"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptVoteRatified = void 0;
const ProtocolEvent_1 = require("../../event/ProtocolEvent");
class AcceptVoteRatified extends ProtocolEvent_1.ProtocolEvent {
    publicKey;
    statement;
    quorum;
    subType = 'AcceptVoteRatified';
    constructor(publicKey, statement, quorum) {
        super(publicKey);
        this.publicKey = publicKey;
        this.statement = statement;
        this.quorum = quorum;
    }
    toString() {
        return `vote(accept(${this.statement.toString()})) ratified by quorum (${Array.from(this.quorum.keys())})`;
    }
}
exports.AcceptVoteRatified = AcceptVoteRatified;
