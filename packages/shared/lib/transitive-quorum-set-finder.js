"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitiveQuorumSetFinder = void 0;
// finds the transitive quorum set for a given quorum set,
// meaning all the nodes reachable starting from the given quorum set
class TransitiveQuorumSetFinder {
    static find(quorumSet, quorumSetMap) {
        return TransitiveQuorumSetFinder.findInternal(quorumSet, quorumSetMap, new Set());
    }
    static findInternal(quorumSet, quorumSetMap, processedNodes) {
        quorumSet.validators.forEach((validator) => {
            if (!processedNodes.has(validator)) {
                processedNodes.add(validator);
                const quorumSet = quorumSetMap.get(validator);
                if (quorumSet) {
                    this.findInternal(quorumSet, quorumSetMap, processedNodes);
                }
            }
        });
        quorumSet.innerQuorumSets.forEach((innerQuorumSet) => {
            this.findInternal(innerQuorumSet, quorumSetMap, processedNodes);
        });
        return processedNodes;
    }
}
exports.TransitiveQuorumSetFinder = TransitiveQuorumSetFinder;
