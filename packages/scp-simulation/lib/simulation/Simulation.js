"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simulation = void 0;
exports.calculateStepHash = calculateStepHash;
const murmurhash_1 = __importDefault(require("murmurhash"));
const federated_voting_1 = require("../federated-voting");
const overlay_1 = require("../overlay");
//The simulation. Works on a context and manages the user and protocol actions. Provides an eventlog, and allows to replay the simulation.
class Simulation {
    context;
    initialStep; //handy to replay the state
    currentStep;
    constructor(context, initialStep) {
        this.context = context;
        if (initialStep) {
            this.initialStep = initialStep;
            this.currentStep = initialStep;
        }
        else {
            this.currentStep = {
                userActions: [],
                protocolActions: [],
                previousEvents: [],
                nextStep: null,
                previousStep: null,
                previousStepHash: ''
            };
            this.initialStep = this.currentStep;
        }
    }
    getFullEventLog() {
        const events = [];
        let stepIterator = this.initialStep;
        while (stepIterator !== this.currentStep.nextStep &&
            stepIterator !== null) {
            events.push(stepIterator.previousEvents);
            stepIterator = stepIterator.nextStep;
        }
        return events;
    }
    getLatestEvents() {
        return this.currentStep.previousEvents;
    }
    addUserAction(action) {
        const existingAction = this.currentStep.userActions.find((a) => a.subType === action.subType &&
            a.publicKey === action.publicKey &&
            !(action instanceof overlay_1.AddConnection ||
                action instanceof overlay_1.RemoveConnection ||
                action instanceof federated_voting_1.ForgeMessage) //todo: we need a better solution! Maybe isIdempotent property?
        );
        if (existingAction) {
            const index = this.currentStep.userActions.indexOf(existingAction);
            this.currentStep.userActions[index] = action;
            return; //replace the action
        }
        this.currentStep.userActions.push(action);
        this.currentStep.userActions.sort((a, b) => {
            if (a.immediateExecution && !b.immediateExecution) {
                return -1;
            }
            if (!a.immediateExecution && b.immediateExecution) {
                return 1;
            }
            return 0;
        }); //make sure that immediate actions are shown first, in order!
        //context should also make sure to execute in this order
    }
    pendingUserActions() {
        return this.currentStep.userActions;
    }
    cancelPendingUserAction(userAction) {
        const index = this.currentStep.userActions.indexOf(userAction);
        if (index > -1) {
            this.currentStep.userActions.splice(index, 1);
        }
    }
    pendingProtocolActions() {
        return this.currentStep.protocolActions;
    }
    //Executes the pending actions. UserActions are always first, then protocol actions
    executeStep() {
        const newActions = this.context.executeActions(this.currentStep.protocolActions, this.currentStep.userActions); //update the context state
        const stepHash = calculateStepHash(this.currentStep, this.context.getOverlaySettings().fullyConnected, this.context.getOverlaySettings().gossipEnabled);
        //because we want to be able to replay predefined scenarios,
        //only when the current step has not been modified
        if (this.currentStep.nextStep !== null &&
            this.currentStep.nextStep.previousStepHash === stepHash) {
            this.currentStep.nextStep.previousEvents = this.context.drainEvents(); //if the step was loaded from JSON, there are no events yet
            this.currentStep = this.currentStep.nextStep; //advance to the next step
            return; //context is deterministic, and if we are playing a scenario, we can reuse the next step, if there is one
        }
        const nextStep = {
            userActions: [],
            protocolActions: newActions,
            previousEvents: this.context.drainEvents(),
            nextStep: null,
            previousStep: this.currentStep,
            previousStepHash: stepHash
        };
        this.currentStep.nextStep = nextStep;
        this.currentStep = nextStep;
    }
    hasNextStep() {
        return (this.currentStep.nextStep !== null ||
            this.currentStep.userActions.length > 0 ||
            this.currentStep.protocolActions.length > 0);
    }
    hasPreviousStep() {
        return this.currentStep.previousStep !== null;
    }
    goBackOneStep() {
        if (this.currentStep.previousStep !== null) {
            this.currentStep = this.currentStep.previousStep;
            this.replayState();
        }
    }
    //event sourcing the state
    replayState() {
        this.context.reset();
        let stepIterator = this.initialStep;
        while (stepIterator !== this.currentStep) {
            this.context.executeActions(stepIterator.protocolActions, stepIterator.userActions);
            this.context.drainEvents();
            //we assume the context is deterministic and we don't need to store the generated actions and events
            if (stepIterator.nextStep === null) {
                break; //should not happen...
            }
            stepIterator = stepIterator.nextStep;
        }
    }
    goToFirstStep() {
        this.currentStep = this.initialStep;
        this.context.reset();
        this.context.drainEvents();
    }
    getInitialStep() {
        return this.initialStep;
    }
}
exports.Simulation = Simulation;
function calculateStepHash(step, isOverlayFullyConnected, isOverlayGossipEnabled) {
    return murmurhash_1.default
        .v3(step.userActions
        .map((a) => JSON.stringify(a.toJSON()))
        .join('|')
        .concat(step.protocolActions.map((a) => JSON.stringify(a.toJSON())).join('|'))
        .concat(isOverlayFullyConnected ? '1' : '0')
        .concat(isOverlayGossipEnabled ? '1' : '0'), 1)
        .toString();
}
