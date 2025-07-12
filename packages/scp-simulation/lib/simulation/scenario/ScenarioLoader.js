"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenarioLoader = void 0;
const federated_voting_1 = require("../../federated-voting");
const Simulation_1 = require("../Simulation");
class ScenarioLoader {
    loadScenario(scenario) {
        const protocolContext = federated_voting_1.FederatedVotingContextFactory.create(scenario.isOverlayFullyConnected, scenario.isOverlayGossipEnabled);
        const simulation = new Simulation_1.Simulation(protocolContext, scenario.initialSimulationStep);
        return {
            protocolContext,
            simulation
        };
    }
}
exports.ScenarioLoader = ScenarioLoader;
