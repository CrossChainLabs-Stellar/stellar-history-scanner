import { QuorumSet } from './quorum-set';
import { TrustGraph } from './trust-graph/trust-graph';
import { Network, PublicKey } from './network';
export declare class QuorumSetService {
    static quorumSetCanReachThreshold(quorumSet: QuorumSet, network: Network, blockedNodes: Set<PublicKey>): boolean;
    /**
     * Determine blocked nodes that cannot reach their quorumset thresholds (recursively) after validating status of
     * other nodes are changed
     * @param network
     * @param nodesTrustGraph
     */
    static calculateBlockedNodes(network: Network, nodesTrustGraph: TrustGraph): Set<string>;
    static quorumSetHasFailingValidators(quorumSet: QuorumSet, network: Network): boolean;
    static isOrganizationQuorumSet(quorumSet: QuorumSet, network: Network): boolean;
}
//# sourceMappingURL=quorum-set-service.d.ts.map