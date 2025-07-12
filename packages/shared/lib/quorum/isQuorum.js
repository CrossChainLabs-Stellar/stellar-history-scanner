"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isQuorum;
const containsSlice_1 = require("./containsSlice");
/**
 * A quorum contains a quorum slice for every node in the quorum
 */
function isQuorum(potentialQuorum) {
    return potentialQuorum.every((node) => (0, containsSlice_1.containsSlice)(node.quorumSet, new Set(potentialQuorum.map((node) => node.publicKey))));
}
