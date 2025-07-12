import { CheckPointGenerator } from '../check-point/CheckPointGenerator';
import { Logger } from 'logger';
import { Result } from 'neverthrow';
import { ExceptionLogger } from 'exception-logger';
import { HttpQueue, Url } from 'http-helper';
import { CategoryScanner } from './CategoryScanner';
import { BucketScanner } from './BucketScanner';
import { ScanError } from '../scan/ScanError';
import { LedgerHeader } from './Scanner';
export interface RangeScanResult {
    latestLedgerHeader?: LedgerHeader;
    scannedBucketHashes: Set<string>;
}
/**
 * Scan a specific range of a history archive
 */
export declare class RangeScanner {
    private checkPointGenerator;
    private categoryScanner;
    private bucketScanner;
    private httpQueue;
    private logger;
    private exceptionLogger;
    constructor(checkPointGenerator: CheckPointGenerator, categoryScanner: CategoryScanner, bucketScanner: BucketScanner, httpQueue: HttpQueue, logger: Logger, exceptionLogger: ExceptionLogger);
    scan(baseUrl: Url, concurrency: number, toLedger: number, fromLedger: number, latestScannedLedger: number, latestScannedLedgerHeaderHash?: string | null, alreadyScannedBucketHashes?: Set<string>): Promise<Result<RangeScanResult, ScanError>>;
    private scanHASFilesAndReturnBucketHashes;
    private scanBucketFiles;
    private scanCategories;
}
//# sourceMappingURL=RangeScanner.d.ts.map