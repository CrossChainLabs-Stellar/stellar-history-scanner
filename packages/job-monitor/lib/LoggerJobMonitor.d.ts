import { JobMonitor, MonitoringJob } from './JobMonitor';
import { Logger } from 'logger';
export declare class LoggerJobMonitor implements JobMonitor {
    private logger;
    constructor(logger: Logger);
    checkIn(job: MonitoringJob): Promise<import("neverthrow").Ok<undefined, never>>;
}
//# sourceMappingURL=LoggerJobMonitor.d.ts.map