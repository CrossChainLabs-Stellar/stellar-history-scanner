import { HasherPool } from './HasherPool';
export declare class WorkerPoolLoadTracker {
    private maxPendingTasks;
    private readonly loadTrackTimer;
    private poolFullCount;
    private poolCheckIfFullCount;
    constructor(workerPool: HasherPool, maxPendingTasks: number);
    private workerPoolIsFull;
    getPoolFullPercentage(): number;
    getPoolFullPercentagePretty(): string;
    stop(): void;
}
//# sourceMappingURL=WorkerPoolLoadTracker.d.ts.map