"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveConnection = void 0;
const core_1 = require("../../core");
class RemoveConnection extends core_1.UserAction {
    a;
    b;
    subType = 'RemoveConnection';
    immediateExecution = true;
    publicKey;
    constructor(a, b) {
        super();
        this.a = a;
        this.b = b;
        this.publicKey = a; //where in the gui do we want to see the action registered?
    }
    execute(context) {
        return context.removeConnection(this.a, this.b);
    }
    toString() {
        return `Remove connection between ${this.a} and ${this.b}`;
    }
    toJSON() {
        return {
            type: this.type,
            subType: this.subType,
            a: this.a,
            b: this.b
        };
    }
    static fromJSON(json) {
        return new RemoveConnection(json.a, json.b);
    }
}
exports.RemoveConnection = RemoveConnection;
