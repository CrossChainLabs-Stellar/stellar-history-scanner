import { HttpQueue, Url } from 'http-helper';
import { CheckPointGenerator } from '../check-point/CheckPointGenerator';
import { Result } from 'neverthrow';
export interface PerformanceTestResult {
    optimalConcurrency: number;
    timeMsPerFile: number;
    isSlowArchive: boolean;
}
export declare class ArchivePerformanceTester {
    private checkPointGenerator;
    private httpQueue;
    private maxTimeMSPerFile;
    constructor(checkPointGenerator: CheckPointGenerator, httpQueue: HttpQueue, maxTimeMSPerFile?: number);
    test(baseUrl: Url, highestLedger: number, largeFiles?: boolean, concurrencyRange?: number[], nrOfCheckPoints?: number): Promise<Result<PerformanceTestResult, Error>>;
    private measureFilesTest;
    private static createHttpAgents;
    private static notEnoughCheckPointsInArchive;
    private testDownload;
}
//# sourceMappingURL=ArchivePerformanceTester.d.ts.map