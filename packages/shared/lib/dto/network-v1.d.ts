import { JSONSchemaType } from 'ajv';
import { NodeV1 } from './node-v1';
import { OrganizationV1 } from './organization-v1';
import { BaseQuorumSet } from '../quorum-set';
export interface NetworkStatisticsV1 {
    time: string;
    nrOfActiveWatchers: number;
    nrOfActiveValidators: number;
    nrOfConnectableNodes: number;
    nrOfActiveFullValidators: number;
    nrOfActiveOrganizations: number;
    transitiveQuorumSetSize: number;
    hasTransitiveQuorumSet: boolean;
    hasQuorumIntersection: boolean;
    minBlockingSetSize: number;
    minBlockingSetFilteredSize: number;
    minBlockingSetOrgsSize: number;
    minBlockingSetOrgsFilteredSize: number;
    minBlockingSetCountrySize: number;
    minBlockingSetCountryFilteredSize: number;
    minBlockingSetISPSize: number;
    minBlockingSetISPFilteredSize: number;
    minSplittingSetSize: number;
    minSplittingSetOrgsSize: number;
    minSplittingSetCountrySize: number;
    minSplittingSetISPSize: number;
    topTierSize: number;
    topTierOrgsSize: number;
    hasSymmetricTopTier: boolean;
}
export interface NetworkV1 {
    time: string;
    latestLedger: string;
    statistics: NetworkStatisticsV1;
    id: string;
    name: string;
    passPhrase: string;
    nodes: NodeV1[];
    organizations: OrganizationV1[];
    transitiveQuorumSet: string[];
    scc: string[][];
    overlayMinVersion?: number;
    overlayVersion?: number;
    maxLedgerVersion?: number;
    stellarCoreVersion?: string;
    quorumSetConfiguration?: BaseQuorumSet;
}
export declare const NetworkV1Schema: JSONSchemaType<NetworkV1>;
//# sourceMappingURL=network-v1.d.ts.map