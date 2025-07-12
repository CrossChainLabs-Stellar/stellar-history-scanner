"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenarioSerializer = void 0;
const Scenario_1 = require("./Scenario");
class ScenarioSerializer {
    simulationStepListSerializer;
    constructor(simulationStepListSerializer) {
        this.simulationStepListSerializer = simulationStepListSerializer;
    }
    toJSON(scenario) {
        return {
            serializeVersion: '1.0.0',
            id: scenario.id,
            name: scenario.name,
            description: scenario.description,
            isOverlayFullyConnected: scenario.isOverlayFullyConnected,
            isOverlayGossipEnabled: scenario.isOverlayGossipEnabled,
            simulationSteps: this.simulationStepListSerializer.toJSON(scenario.initialSimulationStep)
        };
    }
    fromJSON(json) {
        return new Scenario_1.Scenario(json.id, json.name, json.description, json.isOverlayFullyConnected, json.isOverlayGossipEnabled, this.simulationStepListSerializer.fromJSON(json.simulationSteps));
    }
}
exports.ScenarioSerializer = ScenarioSerializer;
