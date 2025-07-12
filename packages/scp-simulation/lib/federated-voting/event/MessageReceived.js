"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageReceived = void 0;
const OverlayEvent_1 = require("../../overlay/event/OverlayEvent");
class MessageReceived extends OverlayEvent_1.OverlayEvent {
    message;
    subType = 'MessageReceived';
    constructor(message) {
        super(message.receiver);
        this.message = message;
    }
    toString() {
        return `${this.message.toString()}`;
    }
}
exports.MessageReceived = MessageReceived;
