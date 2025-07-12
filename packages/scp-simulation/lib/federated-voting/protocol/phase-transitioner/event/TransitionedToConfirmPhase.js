"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitionedToConfirmPhase = void 0;
const ProtocolEvent_1 = require("../../event/ProtocolEvent");
class TransitionedToConfirmPhase extends ProtocolEvent_1.ProtocolEvent {
    publicKey;
    phase;
    statement;
    subType = 'TransitionedToConfirmPhase';
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
exports.TransitionedToConfirmPhase = TransitionedToConfirmPhase;
