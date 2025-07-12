"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
const QuorumSet_1 = require("./QuorumSet");
class Node {
    publicKey;
    _quorumSet;
    constructor(publicKey, quorumSet) {
        this.publicKey = publicKey;
        this._quorumSet = quorumSet;
    }
    updateQuorumSet(quorumSet) {
        this._quorumSet = quorumSet;
    }
    get quorumSet() {
        return this._quorumSet;
    }
    toJSON() {
        return {
            publicKey: this.publicKey,
            quorumSet: this._quorumSet.toJSON()
        };
    }
    static fromJSON(json) {
        return new Node(json.publicKey, QuorumSet_1.QuorumSet.fromJSON(json.quorumSet));
    }
}
exports.Node = Node;
