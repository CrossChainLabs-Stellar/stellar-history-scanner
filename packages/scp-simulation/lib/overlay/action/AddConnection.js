"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddConnection = void 0;
const core_1 = require("../../core");
class AddConnection extends core_1.UserAction {
    a;
    b;
    subType = 'AddConnection';
    immediateExecution = true;
    publicKey;
    constructor(a, b) {
        super();
        this.a = a;
        this.b = b;
        this.publicKey = a; //where in the gui do we want to see the action registered?
    }
    execute(context) {
        return context.addConnection(this.a, this.b);
    }
    toString() {
        return `Add connection between ${this.a} and ${this.b}`;
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
        return new AddConnection(json.a, json.b);
    }
}
exports.AddConnection = AddConnection;
