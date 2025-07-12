import { TrustGraph, Vertex, VertexKey } from './trust-graph';
type Time = number;
export type StronglyConnectedComponent = Set<VertexKey>;
export declare class StronglyConnectedComponentsFinder {
    protected _time: number;
    protected depthFirstSearch(atVertex: Vertex, graph: TrustGraph, visitedVertices: Map<Vertex, Time>, low: Map<Vertex, Time>, stack: Vertex[], onStack: Map<Vertex, boolean>, stronglyConnectedComponents: StronglyConnectedComponent[]): void;
    findTarjan(graph: TrustGraph): StronglyConnectedComponent[];
}
export {};
//# sourceMappingURL=strongly-connected-components-finder.d.ts.map