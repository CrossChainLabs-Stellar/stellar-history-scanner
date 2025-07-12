"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionAdded = void 0;
const OverlayEvent_1 = require("./OverlayEvent");
class ConnectionAdded extends OverlayEvent_1.OverlayEvent {
    a;
    b;
    subType = 'ConnectionAdded';
    constructor(a, b) {
        super(a);
        this.a = a;
        this.b = b;
    }
    toString() {
        return `Connection between ${this.a} and ${this.b} was added`;
    }
}
exports.ConnectionAdded = ConnectionAdded;
