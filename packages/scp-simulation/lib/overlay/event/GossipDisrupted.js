"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GossipDisrupted = void 0;
const OverlayEvent_1 = require("./OverlayEvent");
class GossipDisrupted extends OverlayEvent_1.OverlayEvent {
    gossiper;
    neighbor;
    payload;
    subType = 'GossipDisrupted';
    constructor(gossiper, neighbor, payload) {
        super(gossiper);
        this.gossiper = gossiper;
        this.neighbor = neighbor;
        this.payload = payload;
    }
    toString() {
        return `${this.gossiper} ignored gossip of "${this.payload}" to ${this.neighbor}`;
    }
}
exports.GossipDisrupted = GossipDisrupted;
