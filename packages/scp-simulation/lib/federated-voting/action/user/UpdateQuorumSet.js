"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateQuorumSet = void 0;
const core_1 = require("../../../core");
class UpdateQuorumSet extends core_1.UserAction {
    publicKey;
    quorumSet;
    subType = 'UpdateQuorumSet';
    immediateExecution = true;
    constructor(publicKey, quorumSet) {
        super();
        this.publicKey = publicKey;
        this.quorumSet = quorumSet;
    }
    execute(context) {
        return context.updateQuorumSet(this.publicKey, this.quorumSet);
    }
    toString() {
        return `${this.publicKey}:update quorumSet(${this.quorumSet.toString()})`;
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
        return new UpdateQuorumSet(json.publicKey, core_1.QuorumSet.fromJSON(json.quorumSet));
    }
}
exports.UpdateQuorumSet = UpdateQuorumSet;
