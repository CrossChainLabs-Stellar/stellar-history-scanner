"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeUpdatedQuorumSet = void 0;
const ProtocolEvent_1 = require("./ProtocolEvent");
//todo: is this a ProtocolEvent??
class NodeUpdatedQuorumSet extends ProtocolEvent_1.ProtocolEvent {
    publicKey;
    quorumSet;
    subType = 'NodeUpdatedQuorumSet';
    constructor(publicKey, quorumSet) {
        super(publicKey);
        this.publicKey = publicKey;
        this.quorumSet = quorumSet;
    }
    toString() {
        return `${this.publicKey}:updated to quorumSet(${this.quorumSet.toString()})`;
    }
}
exports.NodeUpdatedQuorumSet = NodeUpdatedQuorumSet;
