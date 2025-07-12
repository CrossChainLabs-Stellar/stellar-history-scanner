import * as P from 'pino';
import { AsyncResultCallback, CrawlQueue } from './crawl-queue';
import { CrawlTask } from './crawl-task';
export declare class CrawlQueueManager {
    private crawlQueue;
    private logger;
    constructor(crawlQueue: CrawlQueue, logger: P.Logger);
    addCrawlTask(crawlTask: CrawlTask): void;
    onDrain(callback: () => void): void;
    queueLength(): number;
    private performCrawlQueueTask;
    completeCrawlQueueTask(crawlQueueTaskDoneCallbacks: Map<string, AsyncResultCallback<void>>, nodeAddress: string): void;
}
//# sourceMappingURL=crawl-queue-manager.d.ts.map