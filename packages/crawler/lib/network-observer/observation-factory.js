"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservationFactory = void 0;
const observation_1 = require("./observation");
class ObservationFactory {
    createObservation(network, slots, topTierAddresses, peerNodes, latestConfirmedClosedLedger, quorumSets) {
        return new observation_1.Observation(network, topTierAddresses, peerNodes, latestConfirmedClosedLedger, quorumSets, slots);
    }
}
exports.ObservationFactory = ObservationFactory;
