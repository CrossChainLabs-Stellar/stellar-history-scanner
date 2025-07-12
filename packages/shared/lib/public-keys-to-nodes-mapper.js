"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicKeysToNodesMap = getPublicKeysToNodesMap;
function getPublicKeysToNodesMap(nodes) {
    const map = new Map();
    nodes
        .filter((node) => node.publicKey)
        .map((node) => map.set(node.publicKey, node));
    return map;
}
