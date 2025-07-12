"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionRemoved = void 0;
const OverlayEvent_1 = require("./OverlayEvent");
class ConnectionRemoved extends OverlayEvent_1.OverlayEvent {
    a;
    b;
    subType = 'ConnectionRemoved';
    constructor(a, b) {
        super(a);
        this.a = a;
        this.b = b;
    }
    toString() {
        return `Connection between ${this.a} and ${this.b} was removed`;
    }
}
exports.ConnectionRemoved = ConnectionRemoved;
