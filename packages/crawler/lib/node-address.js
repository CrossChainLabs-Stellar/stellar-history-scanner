"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeAddressToPeerKey = nodeAddressToPeerKey;
function nodeAddressToPeerKey(nodeAddress) {
    return nodeAddress[0] + ':' + nodeAddress[1];
}
