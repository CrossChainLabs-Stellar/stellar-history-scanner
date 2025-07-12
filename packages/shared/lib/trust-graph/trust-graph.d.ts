import { PublicKey } from '../network';
import { StronglyConnectedComponent, StronglyConnectedComponentsFinder } from './strongly-connected-components-finder';
import { NetworkTransitiveQuorumSetFinder } from './network-transitive-quorum-set-finder';
export type VertexKey = string;
export declare class Vertex {
    readonly key: VertexKey;
    readonly label: string;
    readonly weight: number;
    constructor(publicKey: PublicKey, label: string, weight: number);
    toString(): string;
}
export declare function isVertex(vertex: Vertex | undefined): vertex is Vertex;
export declare class Edge {
    readonly parent: Vertex;
    readonly child: Vertex;
    constructor(parent: Vertex, child: Vertex);
    toString(): string;
}
export declare class TrustGraph {
    protected readonly _stronglyConnectedComponentsFinder: StronglyConnectedComponentsFinder;
    protected readonly _networkTransitiveQuorumSetFinder: NetworkTransitiveQuorumSetFinder;
    protected _vertices: Map<string, Vertex>;
    protected _edges: Set<Edge>;
    protected _stronglyConnectedComponents: StronglyConnectedComponent[];
    protected _stronglyConnectedVertices: Map<PublicKey, number>;
    protected _networkTransitiveQuorumSet: Set<PublicKey>;
    protected children: Map<string, Set<Vertex>>;
    protected parents: Map<string, Set<Vertex>>;
    constructor(stronglyConnectedComponentsFinder: StronglyConnectedComponentsFinder, networkTransitiveQuorumSetFinder: NetworkTransitiveQuorumSetFinder);
    updateStronglyConnectedComponentsAndNetworkTransitiveQuorumSet(): void;
    hasNetworkTransitiveQuorumSet(): boolean;
    get networkTransitiveQuorumSet(): Set<string>;
    addVertex(vertex: Vertex): void;
    getInDegree(vertex: Vertex): number;
    getOutDegree(vertex: Vertex): number;
    isVertexPartOfNetworkTransitiveQuorumSet(publicKey: PublicKey): boolean;
    getStronglyConnectedComponent(key: VertexKey): number | undefined;
    isVertexPartOfStronglyConnectedComponent(publicKey: PublicKey): boolean;
    isEdgePartOfNetworkTransitiveQuorumSet(edge: Edge): boolean;
    isEdgePartOfStronglyConnectedComponent(edge: Edge): boolean;
    hasVertex(publicKey: PublicKey): boolean;
    getVertex(publicKey: PublicKey): Vertex | undefined;
    getChildren(vertex: Vertex): Set<Vertex>;
    getTransitiveChildren(vertex: Vertex): Set<Vertex>;
    hasChild(parent: Vertex, child: Vertex): boolean;
    getParents(vertex: Vertex): Set<Vertex>;
    addEdge(edge: Edge): void;
    get vertices(): Map<string, Vertex>;
    get edges(): Set<Edge>;
    get stronglyConnectedComponents(): StronglyConnectedComponent[];
}
//# sourceMappingURL=trust-graph.d.ts.map