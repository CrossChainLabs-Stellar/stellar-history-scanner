import { JobMonitor, MonitoringJob } from './JobMonitor';
import 'reflect-metadata';
import { Result } from 'neverthrow';
export declare class SentryJobMonitor implements JobMonitor {
    private checkInId;
    constructor(sentryDSN: string);
    checkIn(job: MonitoringJob): Promise<Result<void, Error>>;
}
//# sourceMappingURL=SentryJobMonitor.d.ts.map