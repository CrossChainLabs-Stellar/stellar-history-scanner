"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlQueueManager = void 0;
class CrawlQueueManager {
    crawlQueue;
    logger;
    constructor(crawlQueue, logger) {
        this.crawlQueue = crawlQueue;
        this.logger = logger;
        this.crawlQueue.initialize(this.performCrawlQueueTask.bind(this));
    }
    addCrawlTask(crawlTask) {
        this.crawlQueue.push(crawlTask, (error) => {
            if (error) {
                this.logger.error({ peer: crawlTask.nodeAddress[0] + ':' + crawlTask.nodeAddress[1] }, error.message);
            }
        });
    }
    onDrain(callback) {
        this.crawlQueue.onDrain(callback);
    }
    queueLength() {
        return this.crawlQueue.length();
    }
    performCrawlQueueTask(crawlQueueTask, crawlQueueTaskDone) {
        crawlQueueTask.crawl.crawlQueueTaskDoneCallbacks.set(crawlQueueTask.nodeAddress.join(':'), crawlQueueTaskDone);
        crawlQueueTask.connectCallback();
    }
    completeCrawlQueueTask(crawlQueueTaskDoneCallbacks, nodeAddress) {
        const taskDoneCallback = crawlQueueTaskDoneCallbacks.get(nodeAddress);
        if (taskDoneCallback) {
            taskDoneCallback();
            crawlQueueTaskDoneCallbacks.delete(nodeAddress);
        }
    }
}
exports.CrawlQueueManager = CrawlQueueManager;
