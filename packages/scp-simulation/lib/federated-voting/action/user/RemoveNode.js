"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveNode = void 0;
const core_1 = require("../../../core");
class RemoveNode extends core_1.UserAction {
    publicKey;
    subType = 'RemoveNode';
    immediateExecution = true;
    constructor(publicKey) {
        super();
        this.publicKey = publicKey;
    }
    execute(context) {
        return context.removeNode(this.publicKey);
    }
    toString() {
        return `Remove node ${this.publicKey}`;
    }
    toJSON() {
        return {
            type: this.type,
            subType: this.subType,
            publicKey: this.publicKey
        };
    }
    static fromJSON(json) {
        return new RemoveNode(json.publicKey);
    }
}
exports.RemoveNode = RemoveNode;
