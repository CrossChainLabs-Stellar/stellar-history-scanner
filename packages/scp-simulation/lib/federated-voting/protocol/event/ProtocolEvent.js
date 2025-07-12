"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolEvent = void 0;
class ProtocolEvent {
    publicKey;
    type = 'ProtocolEvent';
    constructor(publicKey) {
        this.publicKey = publicKey;
    }
}
exports.ProtocolEvent = ProtocolEvent;
