"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSent = void 0;
const OverlayEvent_1 = require("../../overlay/event/OverlayEvent");
class MessageSent extends OverlayEvent_1.OverlayEvent {
    message;
    subType = 'MessageSent';
    constructor(message) {
        super(message.sender);
        this.message = message;
    }
    toString() {
        return `${this.message.toString()}`;
    }
}
exports.MessageSent = MessageSent;
