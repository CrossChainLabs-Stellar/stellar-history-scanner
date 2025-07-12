"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddNode = void 0;
const core_1 = require("../../../core");
class AddNode extends core_1.UserAction {
    publicKey;
    quorumSet;
    subType = 'AddNode';
    immediateExecution = true;
    constructor(publicKey, quorumSet) {
        super();
        this.publicKey = publicKey;
        this.quorumSet = quorumSet;
    }
    execute(context) {
        const node = new core_1.Node(this.publicKey, this.quorumSet);
        return context.addNode(node);
    }
    toString() {
        return `Add node ${this.publicKey}`;
    }
    toJSON() {
        return {
            type: this.type,
            subType: this.subType,
            publicKey: this.publicKey,
            quorumSet: this.quorumSet.toJSON()
        };
    }
    static fromJSON(json) {
        return new AddNode(json.publicKey, core_1.QuorumSet.fromJSON(json.quorumSet));
    }
}
exports.AddNode = AddNode;
