import { Result } from 'neverthrow';
import { BucketScanState } from './ScanState';
import { HttpQueue } from 'http-helper';
import { ScanError } from '../scan/ScanError';
export declare class BucketScanner {
    private httpQueue;
    constructor(httpQueue: HttpQueue);
    scan(scanState: BucketScanState, verify?: boolean): Promise<Result<void, ScanError>>;
    private verify;
    private exists;
}
//# sourceMappingURL=BucketScanner.d.ts.map