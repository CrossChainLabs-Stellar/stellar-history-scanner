"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptVoteVBlocked = void 0;
const ProtocolEvent_1 = require("../../event/ProtocolEvent");
class AcceptVoteVBlocked extends ProtocolEvent_1.ProtocolEvent {
    publicKey;
    statement;
    vBlockingSet;
    subType = 'AcceptVoteVBlocked';
    constructor(publicKey, statement, vBlockingSet) {
        super(publicKey);
        this.publicKey = publicKey;
        this.statement = statement;
        this.vBlockingSet = vBlockingSet;
    }
    toString() {
        return `Accept(${this.statement}) votes from ${Array.from(this.vBlockingSet)} are v-blocking`;
    }
}
exports.AcceptVoteVBlocked = AcceptVoteVBlocked;
