"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastFailed = void 0;
const OverlayEvent_1 = require("./OverlayEvent");
class BroadcastFailed extends OverlayEvent_1.OverlayEvent {
    broadcaster;
    payload;
    subType = 'BroadcastFailed';
    constructor(broadcaster, payload) {
        super(broadcaster);
        this.broadcaster = broadcaster;
        this.payload = payload;
    }
    toString() {
        return `${this.broadcaster} failed to broadcast message: "${this.payload}"`;
    }
}
exports.BroadcastFailed = BroadcastFailed;
