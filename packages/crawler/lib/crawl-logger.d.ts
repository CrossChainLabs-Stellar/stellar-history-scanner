import { Crawl } from './crawl';
import { P } from 'pino';
import { CrawlQueueManager } from './crawl-queue-manager';
import { ConnectionManager } from './network-observer/connection-manager';
export declare class CrawlLogger {
    private connectionManager;
    private crawlQueueManager;
    private logger;
    private loggingTimer?;
    private _crawl?;
    constructor(connectionManager: ConnectionManager, crawlQueueManager: CrawlQueueManager, logger: P.Logger);
    get crawl(): Crawl;
    start(crawl: Crawl): void;
    stop(): void;
    private logCrawlState;
}
//# sourceMappingURL=crawl-logger.d.ts.map