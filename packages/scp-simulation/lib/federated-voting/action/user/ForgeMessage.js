"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeMessage = void 0;
const core_1 = require("../../../core");
const Message_1 = require("../../Message");
class ForgeMessage extends core_1.UserAction {
    message;
    subType = 'ForgeMessage';
    immediateExecution = false;
    publicKey;
    constructor(message) {
        super();
        this.message = message;
        this.publicKey = message.sender;
    }
    execute(context) {
        return context.forgeMessage(this.message);
    }
    toString() {
        return `Forge message from ${this.publicKey} to ${this.message.receiver}: "${this.message.vote}"`;
    }
    toJSON() {
        return {
            type: this.type,
            subType: this.subType,
            message: this.message.toJSON()
        };
    }
    static fromJSON(json) {
        return new ForgeMessage(Message_1.Message.fromJSON(json.message));
    }
}
exports.ForgeMessage = ForgeMessage;
