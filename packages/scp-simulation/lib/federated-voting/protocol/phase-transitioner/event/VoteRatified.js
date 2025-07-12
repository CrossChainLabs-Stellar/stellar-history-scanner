"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteRatified = void 0;
const ProtocolEvent_1 = require("../../event/ProtocolEvent");
class VoteRatified extends ProtocolEvent_1.ProtocolEvent {
    publicKey;
    statement;
    quorum;
    subType = 'VoteRatified';
    constructor(publicKey, statement, quorum) {
        super(publicKey);
        this.publicKey = publicKey;
        this.statement = statement;
        this.quorum = quorum;
    }
    toString() {
        return `vote(${this.statement.toString()}) ratified by quorum (${Array.from(this.quorum.keys())})`;
    }
}
exports.VoteRatified = VoteRatified;
