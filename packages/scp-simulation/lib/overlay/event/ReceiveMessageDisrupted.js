"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveMessageDisrupted = void 0;
const OverlayEvent_1 = require("./OverlayEvent");
class ReceiveMessageDisrupted extends OverlayEvent_1.OverlayEvent {
    receiver;
    from;
    payload;
    subType = 'ReceiveMessageDisrupted';
    constructor(receiver, from, payload) {
        super(receiver);
        this.receiver = receiver;
        this.from = from;
        this.payload = payload;
    }
    toString() {
        return `${this.receiver} ignored message from ${this.from}: "${this.payload}"`;
    }
}
exports.ReceiveMessageDisrupted = ReceiveMessageDisrupted;
