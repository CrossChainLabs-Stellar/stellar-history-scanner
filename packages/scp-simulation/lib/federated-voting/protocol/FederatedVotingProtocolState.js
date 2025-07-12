"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederatedVotingProtocolState = exports.FederatedVotingPhase = void 0;
var FederatedVotingPhase;
(function (FederatedVotingPhase) {
    FederatedVotingPhase["unknown"] = "unknown";
    FederatedVotingPhase["accepted"] = "accepted";
    FederatedVotingPhase["confirmed"] = "confirmed";
})(FederatedVotingPhase || (exports.FederatedVotingPhase = FederatedVotingPhase = {}));
class FederatedVotingProtocolState {
    node;
    processedVotes = [];
    voted = null;
    accepted = null;
    confirmed = null;
    phase = FederatedVotingPhase.unknown;
    constructor(node) {
        this.node = node;
    }
}
exports.FederatedVotingProtocolState = FederatedVotingProtocolState;
