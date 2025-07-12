import { BaseQuorumSet, Node, Organization, QuorumSet, QuorumSetService, TrustGraph, TrustGraphBuilder } from './index';
import NetworkStatistics from './network-statistics';
import { NetworkV1 } from './dto/network-v1';
export type OrganizationId = string;
export type PublicKey = string;
export declare class Network {
    nodes: Node[];
    organizations: Organization[];
    time: Date;
    latestLedger: string | null;
    protected _trustGraphBuilder: TrustGraphBuilder;
    protected _nodesTrustGraph: TrustGraph;
    protected _quorumSetService: QuorumSetService;
    protected _networkStatistics: NetworkStatistics;
    name?: string;
    id?: string;
    passPhrase?: string;
    overlayMinVersion?: number;
    overlayVersion?: number;
    maxLedgerVersion?: number;
    stellarCoreVersion?: string;
    quorumSetConfiguration?: BaseQuorumSet;
    blockedNodes: Set<string>;
    protected nodesMap: Map<PublicKey, Node>;
    protected organizationsMap: Map<string, Organization>;
    constructor(nodes?: Node[], organizations?: Organization[], time?: Date, latestLedger?: string | null, networkStatistics?: NetworkStatistics);
    protected initializeBlockedNodes(): void;
    get networkStatistics(): NetworkStatistics;
    updateNetworkStatistics(fbasAnalysisResult?: unknown): void;
    initializeNodesTrustGraph(): void;
    initializeOrganizationsMap(): void;
    recalculateNetwork(): void;
    isOrganizationMissing(organization: Organization): boolean;
    isOrganizationFailing(organization: Organization): boolean;
    isOrganizationBlocked(organization: Organization): boolean;
    updateOrganizationSubQuorumAvailabilityStates(): void;
    isQuorumSetBlocked(node: Node, innerQuorumSet?: QuorumSet): boolean;
    getNodeByPublicKey(publicKey: PublicKey): Node;
    getOrganizationById(id: OrganizationId): Organization;
    get nodesTrustGraph(): TrustGraph;
    getTrustingNodes(node: Node): Node[];
    getTrustedOrganizations(quorumSet: QuorumSet): Organization[];
    protected getPublicKeyToNodeMap(nodes: Node[]): Map<string, Node>;
    getTrustedOrganizationsByOrganization(organization: Organization): Organization[];
    /**
     * A node can fail for various reasons. See Fig. 5.   Venn diagram of node failures of the original SCP paper.
     * When a node is missing we mark it as failed.
     * If we modify the network for simulation purposes, we mark validators that are blocked as failed.
     */
    isNodeFailing(node: Node): boolean;
    isValidatorBlocked(validator: Node): boolean;
    someNodesHaveWarnings(nodes: Node[]): boolean;
    nodeHasWarnings(node: Node): boolean;
    getNodeWarningReasons(node: Node): string;
    isFullValidatorWithOutOfDateArchive(node: Node): boolean;
    historyArchiveHasError(node: Node): boolean;
    getNodeFailingReason(node: Node): {
        label: string;
        description: string;
    };
    static fromJSON(networkV1DTO: NetworkV1): Network;
    toJSON(): Record<string, unknown>;
}
//# sourceMappingURL=network.d.ts.map