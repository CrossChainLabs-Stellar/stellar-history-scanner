"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerPoolLoadTracker = void 0;
class WorkerPoolLoadTracker {
    maxPendingTasks;
    loadTrackTimer;
    poolFullCount = 0;
    poolCheckIfFullCount = 0;
    constructor(workerPool, maxPendingTasks) {
        this.maxPendingTasks = maxPendingTasks;
        this.loadTrackTimer = setInterval(() => {
            this.poolCheckIfFullCount++;
            if (this.workerPoolIsFull(workerPool))
                //pool 80 percent of max pending is considered full
                this.poolFullCount++;
        }, 10000);
    }
    workerPoolIsFull(pool) {
        return pool.workerpool.stats().pendingTasks >= this.maxPendingTasks * 0.8;
    }
    getPoolFullPercentage() {
        return this.poolCheckIfFullCount > 0
            ? Math.round((this.poolFullCount / this.poolCheckIfFullCount) * 100)
            : 0;
    }
    getPoolFullPercentagePretty() {
        return this.getPoolFullPercentage() + '%';
    }
    stop() {
        clearInterval(this.loadTrackTimer);
    }
}
exports.WorkerPoolLoadTracker = WorkerPoolLoadTracker;
