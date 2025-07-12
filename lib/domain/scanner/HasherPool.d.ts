import { WorkerPool } from 'workerpool';
export declare class HasherPool {
    workerpool: WorkerPool;
    terminated: boolean;
    constructor();
}
export interface HasherPool {
    terminated: boolean;
    workerpool: WorkerPool;
}
//# sourceMappingURL=HasherPool.d.ts.map