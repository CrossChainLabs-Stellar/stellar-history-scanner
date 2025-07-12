import { PublicKey, QuorumSet } from '../../core';
export declare class QuorumSetService {
    static isSetVBlocking(nodeSet: PublicKey[], quorumSet: QuorumSet): boolean;
    private static isSetVBlockingInternal;
    private static getMinimumBlockingSetSize;
    static calculatePotentiallyBlockedNodes(quorumSets: Map<PublicKey, QuorumSet>, illBehavedNodes: Array<PublicKey>): Set<string>;
    static quorumSetCanReachThreshold(quorumSet: QuorumSet, livenessBefouledNodes: PublicKey[]): boolean;
}
//# sourceMappingURL=QuorumSetService.d.ts.map