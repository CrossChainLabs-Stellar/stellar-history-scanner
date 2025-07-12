"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationStepSerializer = void 0;
const federated_voting_1 = require("../../federated-voting");
const federated_voting_2 = require("../../federated-voting");
const ReceiveMessage_1 = require("../../federated-voting/action/protocol/ReceiveMessage");
const overlay_1 = require("../../overlay");
/**
 * Class for serializing and deserializing SimulationStep objects
 */
class SimulationStepSerializer {
    /**
     * Convert a SimulationStep to a JSON-serializable object
     */
    toJSON(step) {
        return {
            userActions: step.userActions.map((action) => action.toJSON()),
            protocolActions: step.protocolActions.map((action) => action.toJSON()),
            previousStepHash: step.previousStepHash ?? ''
        };
    }
    /**
     * Create a SimulationStep from a serialized object
     * Note: This creates a partial SimulationStep with null references for nextStep and previousStep
     * These should be linked appropriately by the Simulation class
     */
    fromJSON(json) {
        const userActions = json.userActions.map((actionJson) => this.deserializeUserAction(actionJson));
        const protocolActions = json.protocolActions.map((actionJson) => this.deserializeProtocolAction(actionJson));
        return {
            userActions,
            protocolActions,
            previousEvents: [], // Events will be regenerated during execution
            nextStep: null, //after loading all steps
            previousStep: null, // after loading all steps
            previousStepHash: json.previousStepHash
        };
    }
    deserializeUserAction(actionJson) {
        switch (actionJson.subType) {
            case 'AddNode':
                return federated_voting_1.AddNode.fromJSON(actionJson);
            case 'RemoveNode':
                return federated_voting_1.RemoveNode.fromJSON(actionJson);
            case 'UpdateQuorumSet':
                return federated_voting_1.UpdateQuorumSet.fromJSON(actionJson);
            case 'VoteOnStatement':
                return federated_voting_1.VoteOnStatement.fromJSON(actionJson);
            case 'ForgeMessage':
                return federated_voting_2.ForgeMessage.fromJSON(actionJson);
            case 'AddConnection':
                return overlay_1.AddConnection.fromJSON(actionJson);
            case 'RemoveConnection':
                return overlay_1.RemoveConnection.fromJSON(actionJson);
            default:
                throw new Error(`Unknown user action type: ${actionJson.subType}`);
        }
    }
    deserializeProtocolAction(actionJson) {
        switch (actionJson.subType) {
            case 'Broadcast':
                return federated_voting_1.Broadcast.fromJSON(actionJson);
            case 'Gossip':
                return overlay_1.Gossip.fromJSON(actionJson);
            case 'ReceiveMessage':
                return ReceiveMessage_1.ReceiveMessage.fromJSON(actionJson);
            default:
                throw new Error(`Unknown protocol action type: ${actionJson.subType}`);
        }
    }
}
exports.SimulationStepSerializer = SimulationStepSerializer;
