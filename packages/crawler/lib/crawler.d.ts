import * as P from 'pino';
import { Crawl } from './crawl';
import { CrawlResult } from './crawl-result';
import { CrawlerConfiguration } from './crawler-configuration';
import { CrawlLogger } from './crawl-logger';
import { CrawlQueueManager } from './crawl-queue-manager';
import { MaxCrawlTimeManager } from './max-crawl-time-manager';
import { NetworkObserver } from './network-observer/network-observer';
export interface Ledger {
    sequence: bigint;
    closeTime: Date;
    localCloseTime: Date;
    value: string;
}
/**
 * The crawler is the orchestrator of the crawling process.
 * It connects to nodes, delegates the handling of incoming messages to the StellarMessageHandler,
 * and manages the crawl state.
 */
export declare class Crawler {
    private config;
    private crawlQueueManager;
    private maxCrawlTimeManager;
    private networkObserver;
    private crawlLogger;
    readonly logger: P.Logger;
    private _crawl;
    constructor(config: CrawlerConfiguration, crawlQueueManager: CrawlQueueManager, maxCrawlTimeManager: MaxCrawlTimeManager, networkObserver: NetworkObserver, crawlLogger: CrawlLogger, logger: P.Logger);
    startCrawl(crawl: Crawl): Promise<CrawlResult>;
    private isCrawlRunning;
    private setupPeerListenerEvents;
    private onPeerAddressesReceived;
    private syncTopTierAndCrawl;
    private startCrawlProcess;
    private startTopTierSync;
    private setupCrawlCompletionHandlers;
    private startMaxCrawlTimeout;
    private finish;
    private hasCrawlTimedOut;
    private constructCrawlResult;
    private crawlPeerNode;
    private logNodeAddition;
    private canNodeBeCrawled;
    private get crawl();
    private set crawl(value);
}
//# sourceMappingURL=crawler.d.ts.map