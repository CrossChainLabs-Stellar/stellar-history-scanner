"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastVoteRequested = void 0;
const ProtocolEvent_1 = require("./ProtocolEvent");
class BroadcastVoteRequested extends ProtocolEvent_1.ProtocolEvent {
    publicKey;
    vote;
    subType = 'BroadCastVoteRequested';
    constructor(publicKey, vote) {
        super(publicKey);
        this.publicKey = publicKey;
        this.vote = vote;
    }
    toString() {
        return `${this.vote.toString()}`;
    }
}
exports.BroadcastVoteRequested = BroadcastVoteRequested;
