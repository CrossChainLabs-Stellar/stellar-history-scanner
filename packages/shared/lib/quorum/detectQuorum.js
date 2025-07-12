"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = detectQuorum;
const containsSlice_1 = require("./containsSlice");
/**
 * detects if the nodes array contains a quorum and returns the first detected.
 */
function detectQuorum(nodes) {
    const nodesThatContainSlice = nodes.filter((node) => (0, containsSlice_1.containsSlice)(node.quorumSet, new Set(nodes.map((node) => node.publicKey))));
    if (nodesThatContainSlice.length === nodes.length)
        //all the nodes contain a slice, we have a quorum!
        return nodesThatContainSlice;
    if (nodes.length === 0)
        return [];
    else
        return detectQuorum(nodesThatContainSlice); //it could be that the remaining nodes depended on the filtered out nodes to complete their slices. So we have to check again if the new set of nodes form a quorum.
}
