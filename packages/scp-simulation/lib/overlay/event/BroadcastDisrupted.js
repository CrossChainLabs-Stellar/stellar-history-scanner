"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastDisrupted = void 0;
const OverlayEvent_1 = require("./OverlayEvent");
class BroadcastDisrupted extends OverlayEvent_1.OverlayEvent {
    broadcaster;
    neighbor;
    payload;
    subType = 'BroadcastDisrupted';
    constructor(broadcaster, neighbor, payload) {
        super(broadcaster);
        this.broadcaster = broadcaster;
        this.neighbor = neighbor;
        this.payload = payload;
    }
    toString() {
        return `${this.broadcaster} did not broadcast"${this.payload}" to ${this.neighbor}`;
    }
}
exports.BroadcastDisrupted = BroadcastDisrupted;
