"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsensusReached = void 0;
const ProtocolEvent_1 = require("./ProtocolEvent");
class ConsensusReached extends ProtocolEvent_1.ProtocolEvent {
    publicKey;
    statement;
    subType = 'ConsensusReached';
    constructor(publicKey, statement) {
        super(publicKey);
        this.publicKey = publicKey;
        this.statement = statement;
    }
    toString() {
        return `Consensus reached on ${this.statement.toString()}`;
    }
}
exports.ConsensusReached = ConsensusReached;
