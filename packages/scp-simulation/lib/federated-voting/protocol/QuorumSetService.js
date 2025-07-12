"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuorumSetService = void 0;
class QuorumSetService {
    static isSetVBlocking(nodeSet, quorumSet) {
        return this.isSetVBlockingInternal(nodeSet, quorumSet);
    }
    static isSetVBlockingInternal(nodeSet, quorumSet) {
        if (quorumSet.threshold === 0) {
            return false; // Cannot overlap empty slices
        }
        let leftUntilBlocked = this.getMinimumBlockingSetSize(quorumSet);
        for (const validator of quorumSet.validators) {
            if (nodeSet.includes(validator)) {
                leftUntilBlocked--;
                if (leftUntilBlocked === 0) {
                    return true;
                }
            }
        }
        for (const innerQSet of quorumSet.innerQuorumSets) {
            if (this.isSetVBlockingInternal(nodeSet, innerQSet)) {
                leftUntilBlocked--;
                if (leftUntilBlocked === 0) {
                    return true;
                }
            }
        }
        return false; // We can still reach the threshold
    }
    static getMinimumBlockingSetSize(quorumSet) {
        return (quorumSet.validators.length +
            quorumSet.innerQuorumSets.length -
            quorumSet.threshold +
            1);
    }
    static calculatePotentiallyBlockedNodes(quorumSets, illBehavedNodes) {
        const blockedNodes = new Set();
        let recalculateBlockedNodes = true;
        while (recalculateBlockedNodes) {
            recalculateBlockedNodes = false;
            quorumSets.forEach((quorumSet, publicKey) => {
                if (illBehavedNodes.includes(publicKey)) {
                    return;
                }
                if (blockedNodes.has(publicKey)) {
                    return;
                }
                if (this.quorumSetCanReachThreshold(quorumSet, Array.from(blockedNodes).concat(illBehavedNodes))) {
                    return;
                }
                blockedNodes.add(publicKey);
                recalculateBlockedNodes = true;
            });
        }
        return blockedNodes;
    }
    static quorumSetCanReachThreshold(quorumSet, livenessBefouledNodes) {
        let counter = quorumSet.validators.filter((validator) => !livenessBefouledNodes.includes(validator)).length;
        quorumSet.innerQuorumSets.forEach((innerQS) => {
            if (this.quorumSetCanReachThreshold(innerQS, livenessBefouledNodes)) {
                counter++;
            }
        });
        return counter >= quorumSet.threshold;
    }
}
exports.QuorumSetService = QuorumSetService;
