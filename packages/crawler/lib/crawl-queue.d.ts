import { CrawlTask } from './crawl-task';
export interface CrawlQueue {
    push(crawlTask: CrawlTask, error: () => void): void;
    onDrain(callback: () => void): void;
    activeTasks(): CrawlTask[];
    length(): number;
    initialize(performTask: (task: CrawlTask, done: AsyncResultCallback<void>) => void): void;
}
export type AsyncResultCallback<T, E = Error> = (err?: E | null, result?: T) => void;
export declare class AsyncCrawlQueue implements CrawlQueue {
    private maxOpenConnections;
    private _crawlQueue?;
    constructor(maxOpenConnections: number);
    private get crawlQueue();
    initialize(performTask: (task: CrawlTask, done: AsyncResultCallback<void>) => void): void;
    push<R, E = Error>(crawlTask: CrawlTask, callback: AsyncResultCallback<R, E>): void;
    onDrain(callback: () => void): void;
    length(): number;
    activeTasks(): CrawlTask[];
}
//# sourceMappingURL=crawl-queue.d.ts.map