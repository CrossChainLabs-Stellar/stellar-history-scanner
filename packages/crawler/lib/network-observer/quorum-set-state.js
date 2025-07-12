"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuorumSetState = void 0;
class QuorumSetState {
    quorumSetOwners = new Map();
    quorumSetRequestedTo = new Map();
    quorumSetHashesInProgress = new Set();
    quorumSetRequests = new Map();
}
exports.QuorumSetState = QuorumSetState;
