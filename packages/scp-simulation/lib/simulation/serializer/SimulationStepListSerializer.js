"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationStepListSerializer = void 0;
class SimulationStepListSerializer {
    stepSerializer;
    constructor(stepSerializer) {
        this.stepSerializer = stepSerializer;
    }
    toJSON(initialSimulationStep) {
        let step = initialSimulationStep;
        const steps = [this.stepSerializer.toJSON(step)];
        while (step.nextStep) {
            step = step.nextStep;
            steps.push(this.stepSerializer.toJSON(step));
        }
        return steps;
    }
    fromJSON(json) {
        if (json.length === 0) {
            throw new Error('Cannot deserialize empty array');
        }
        const steps = json.map((stepJson) => this.stepSerializer.fromJSON(stepJson));
        for (let i = 0; i < steps.length - 1; i++) {
            steps[i].nextStep = steps[i + 1];
            steps[i + 1].previousStep = steps[i];
        }
        return steps[0];
    }
}
exports.SimulationStepListSerializer = SimulationStepListSerializer;
