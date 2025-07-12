"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteOnStatement = void 0;
const core_1 = require("../../../core");
class VoteOnStatement extends core_1.UserAction {
    publicKey;
    statement;
    subType = 'VoteOnStatement';
    immediateExecution = false;
    constructor(publicKey, statement) {
        super();
        this.publicKey = publicKey;
        this.statement = statement;
    }
    execute(context) {
        return context.vote(this.publicKey, this.statement);
    }
    toString() {
        return `${this.publicKey}:vote(${this.statement.toString()})`;
    }
    toJSON() {
        return {
            type: this.type,
            subType: this.subType,
            publicKey: this.publicKey,
            statement: this.statement
        };
    }
    static fromJSON(json) {
        return new VoteOnStatement(json.publicKey, json.statement);
    }
}
exports.VoteOnStatement = VoteOnStatement;
