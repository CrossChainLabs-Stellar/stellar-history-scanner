import { AsyncResultCallback } from 'async';
import { NodeAddress } from './node-address';
import { Observation } from './network-observer/observation';
export declare enum CrawlProcessState {
    IDLE = 0,
    TOP_TIER_SYNC = 1,
    CRAWLING = 2,
    STOPPING = 3
}
export declare class Crawl {
    nodesToCrawl: NodeAddress[];
    observation: Observation;
    state: CrawlProcessState;
    maxCrawlTimeHit: boolean;
    crawlQueueTaskDoneCallbacks: Map<string, AsyncResultCallback<void, Error>>;
    crawledNodeAddresses: Set<string>;
    failedConnections: string[];
    peerAddressesReceivedDuringSync: NodeAddress[];
    constructor(nodesToCrawl: NodeAddress[], observation: Observation);
}
//# sourceMappingURL=crawl.d.ts.map