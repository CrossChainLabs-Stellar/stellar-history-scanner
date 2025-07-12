"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederatedVotingContextFactory = void 0;
const overlay_1 = require("../overlay");
const FederatedVotingContext_1 = require("./FederatedVotingContext");
const FederatedVotingProtocol_1 = require("./protocol/FederatedVotingProtocol");
const PhaseTransitioner_1 = require("./protocol/phase-transitioner/PhaseTransitioner");
class FederatedVotingContextFactory {
    static create(overlayFullyConnected = true, overlayGossipEnabled = false) {
        return new FederatedVotingContext_1.FederatedVotingContext(new FederatedVotingProtocol_1.FederatedVotingProtocol(new PhaseTransitioner_1.PhaseTransitioner()), new overlay_1.Overlay(overlayFullyConnected, overlayGossipEnabled));
    }
}
exports.FederatedVotingContextFactory = FederatedVotingContextFactory;
