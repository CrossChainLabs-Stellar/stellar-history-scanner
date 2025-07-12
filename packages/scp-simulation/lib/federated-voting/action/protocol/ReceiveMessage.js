"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveMessage = void 0;
const Message_1 = require("../../Message");
const core_1 = require("../../../core");
class ReceiveMessage extends core_1.ProtocolAction {
    message;
    subType = 'ReceiveMessage';
    publicKey;
    constructor(message) {
        super();
        this.message = message;
        this.publicKey = message.receiver;
    }
    execute(context) {
        return context.receiveMessage(this.message, this.isDisrupted);
    }
    toString() {
        return `${this.message.toString()}`;
    }
    toJSON() {
        return {
            type: this.type,
            subType: this.subType,
            message: this.message.toJSON(),
            isDisrupted: this.isDisrupted
        };
    }
    static fromJSON(json) {
        const message = Message_1.Message.fromJSON(json.message);
        const receiveMessage = new ReceiveMessage(message);
        receiveMessage.isDisrupted = json.isDisrupted;
        return receiveMessage;
    }
}
exports.ReceiveMessage = ReceiveMessage;
