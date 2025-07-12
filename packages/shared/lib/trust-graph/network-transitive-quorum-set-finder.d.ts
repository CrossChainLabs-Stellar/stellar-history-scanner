import { TrustGraph } from './trust-graph';
import { StronglyConnectedComponent } from './strongly-connected-components-finder';
export declare class NetworkTransitiveQuorumSetFinder {
    getTransitiveQuorumSet(stronglyConnectedComponents: StronglyConnectedComponent[], graph: TrustGraph): StronglyConnectedComponent;
    protected hasOutgoingEdgesNotPartOfComponent(stronglyConnectedComponent: StronglyConnectedComponent, graph: TrustGraph): boolean;
}
//# sourceMappingURL=network-transitive-quorum-set-finder.d.ts.map