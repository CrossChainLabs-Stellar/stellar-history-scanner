"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitionedToAcceptPhase = void 0;
const ProtocolEvent_1 = require("../../event/ProtocolEvent");
class TransitionedToAcceptPhase extends ProtocolEvent_1.ProtocolEvent {
    publicKey;
    phase;
    statement;
    subType = 'TransitionedToAcceptPhase';
    constructor(publicKey, phase, statement) {
        super(publicKey);
        this.publicKey = publicKey;
        this.phase = phase;
        this.statement = statement;
    }
    toString() {
        return `${this.statement.toString()}`;
    }
}
exports.TransitionedToAcceptPhase = TransitionedToAcceptPhase;
