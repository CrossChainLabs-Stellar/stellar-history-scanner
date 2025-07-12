import { NodeConfig } from 'node-connector';
export declare class CrawlerConfiguration {
    nodeConfig: NodeConfig;
    maxOpenConnections: number;
    maxCrawlTime: number;
    blackList: Set<string>;
    peerStraggleTimeoutMS: number;
    syncingTimeoutMS: number;
    quorumSetRequestTimeoutMS: number;
    consensusTimeoutMS: number;
    constructor(nodeConfig: NodeConfig, //How many connections can be open at the same time. The higher the number, the faster the crawl
    maxOpenConnections?: number, //How many (non-top tier) peer connections can be open at the same time. The higher the number, the faster the crawl, but the more risk of higher latencies
    maxCrawlTime?: number, //max nr of ms the crawl will last. Safety guard in case crawler is stuck.
    blackList?: Set<string>, //nodes that are not crawled
    peerStraggleTimeoutMS?: number, //time in ms that we listen to a node to determine if it is validating a confirmed closed ledger
    syncingTimeoutMS?: number, //time in ms that the network observer waits for the top tiers to sync
    quorumSetRequestTimeoutMS?: number, //time in ms that we wait for a quorum set to be received from a single peer
    consensusTimeoutMS?: number);
}
//# sourceMappingURL=crawler-configuration.d.ts.map