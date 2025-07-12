"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncCrawlQueue = void 0;
const async_1 = require("async");
class AsyncCrawlQueue {
    maxOpenConnections;
    _crawlQueue;
    constructor(maxOpenConnections) {
        this.maxOpenConnections = maxOpenConnections;
    }
    get crawlQueue() {
        if (!this._crawlQueue)
            throw new Error('Crawl queue not set up');
        return this._crawlQueue;
    }
    initialize(performTask) {
        this._crawlQueue = (0, async_1.queue)(performTask, this.maxOpenConnections);
    }
    push(crawlTask, callback) {
        this.crawlQueue.push(crawlTask, callback);
    }
    onDrain(callback) {
        this.crawlQueue.drain(callback);
    }
    length() {
        return this.crawlQueue.length();
    }
    activeTasks() {
        return this.crawlQueue.workersList().map((worker) => worker.data);
    }
}
exports.AsyncCrawlQueue = AsyncCrawlQueue;
