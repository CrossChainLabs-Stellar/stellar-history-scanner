"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgedMessageSent = void 0;
const OverlayEvent_1 = require("../../overlay/event/OverlayEvent");
class ForgedMessageSent extends OverlayEvent_1.OverlayEvent {
    message;
    subType = 'ForgedMessageSent';
    constructor(message) {
        super(message.sender);
        this.message = message;
    }
    toString() {
        return `${this.message.sender.toString()} sent forged message to: ${this.message.receiver.toString()}: ${this.message.vote.toString()}`;
    }
}
exports.ForgedMessageSent = ForgedMessageSent;
