import { Node, PublicKey, QuorumSet } from '../../core';
export declare class QuorumService {
    /**
     * Check if the given quorumCandidate is a quorum and that the publicKey with quorumSet is a member.
     *
     * A quorum is a set of nodes where every member has a slice in the quorum.
     */
    static isQuorumContainingNode(node: Node, quorumCandidate: Map<PublicKey, QuorumSet>): Map<PublicKey, QuorumSet> | null;
    private static removeMembersWithoutSlice;
    private static hasSliceInSet;
}
//# sourceMappingURL=QuorumService.d.ts.map