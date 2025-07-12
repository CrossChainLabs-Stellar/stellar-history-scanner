import { Network } from '../network';
import { QuorumSet } from '../quorum-set';
import { TrustGraph, Vertex } from './trust-graph';
export declare class TrustGraphBuilder {
    protected network: Network;
    constructor(network: Network);
    buildGraphFromOrganizations(): TrustGraph;
    buildGraphFromNodes(includeWatchers?: boolean): TrustGraph;
    protected addNodeEdges(parent: Vertex, quorumSet: QuorumSet, graph: TrustGraph): void;
}
//# sourceMappingURL=trust-graph-builder.d.ts.map