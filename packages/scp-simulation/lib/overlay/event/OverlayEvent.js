"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverlayEvent = void 0;
class OverlayEvent {
    publicKey;
    type = 'OverlayEvent';
    constructor(publicKey) {
        this.publicKey = publicKey;
    }
}
exports.OverlayEvent = OverlayEvent;
