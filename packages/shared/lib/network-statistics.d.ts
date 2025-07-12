import { NetworkStatisticsV1 } from './dto/network-v1';
export default class NetworkStatistics {
    time: Date;
    nrOfActiveWatchers: number;
    nrOfConnectableNodes: number;
    nrOfActiveValidators: number;
    nrOfActiveFullValidators: number;
    nrOfActiveOrganizations: number;
    transitiveQuorumSetSize: number;
    hasTransitiveQuorumSet: boolean;
    hasQuorumIntersection?: boolean;
    minBlockingSetSize?: number;
    minBlockingSetFilteredSize: number;
    minBlockingSetOrgsSize?: number;
    minBlockingSetOrgsFilteredSize?: number;
    minBlockingSetCountrySize?: number;
    minBlockingSetCountryFilteredSize?: number;
    minBlockingSetISPSize?: number;
    minBlockingSetISPFilteredSize?: number;
    minSplittingSetSize?: number;
    minSplittingSetOrgsSize?: number;
    minSplittingSetCountrySize?: number;
    minSplittingSetISPSize?: number;
    topTierSize?: number;
    topTierOrgsSize?: number;
    hasSymmetricTopTier: boolean;
    static fromJSON(networkStatsObject: NetworkStatisticsV1): NetworkStatistics;
}
//# sourceMappingURL=network-statistics.d.ts.map