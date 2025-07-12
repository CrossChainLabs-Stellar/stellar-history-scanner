"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scenario = void 0;
class Scenario {
    id;
    name;
    description;
    isOverlayFullyConnected;
    isOverlayGossipEnabled;
    initialSimulationStep;
    constructor(id, name, description, isOverlayFullyConnected, isOverlayGossipEnabled, initialSimulationStep) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isOverlayFullyConnected = isOverlayFullyConnected;
        this.isOverlayGossipEnabled = isOverlayGossipEnabled;
        this.initialSimulationStep = initialSimulationStep;
    }
}
exports.Scenario = Scenario;
