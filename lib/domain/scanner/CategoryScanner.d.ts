import { Result } from 'neverthrow';
import { HttpQueue, Url } from 'http-helper';
import { HASValidator } from '../history-archive/HASValidator';
import { ScanError } from '../scan/ScanError';
import { CheckPointGenerator } from '../check-point/CheckPointGenerator';
import { CategoryScanState } from './ScanState';
import { LedgerHeader } from './Scanner';
import { CategoryVerificationService } from './CategoryVerificationService';
type Ledger = number;
type Hash = string;
export interface ExpectedHashes {
    txSetHash: Hash;
    txSetResultHash: Hash;
    previousLedgerHeaderHash: Hash;
    bucketListHash: Hash;
}
export type ExpectedHashesPerLedger = Map<Ledger, ExpectedHashes>;
export type CalculatedTxSetHashes = Map<Ledger, Hash>;
export type CalculatedTxSetResultHashes = Map<Ledger, Hash>;
export type LedgerHeaderHashes = Map<Ledger, Hash | undefined>;
export interface CategoryVerificationData {
    calculatedTxSetHashes: CalculatedTxSetHashes;
    expectedHashesPerLedger: ExpectedHashesPerLedger;
    calculatedTxSetResultHashes: CalculatedTxSetResultHashes;
    calculatedLedgerHeaderHashes: LedgerHeaderHashes;
    protocolVersions: Map<number, number>;
}
export declare class CategoryScanner {
    private hasValidator;
    private httpQueue;
    private checkPointGenerator;
    private categoryVerificationService;
    static ZeroXdrHash: string;
    static ZeroHash: string;
    static POOL_MAX_PENDING_TASKS: number;
    constructor(hasValidator: HASValidator, httpQueue: HttpQueue, checkPointGenerator: CheckPointGenerator, categoryVerificationService: CategoryVerificationService);
    findLatestLedger(baseUrl: Url): Promise<Result<number, ScanError>>;
    scanHASFilesAndReturnBucketHashes(scanState: CategoryScanState, verify?: boolean): Promise<Result<{
        bucketHashes: Set<string>;
        bucketListHashes: Map<number, string>;
    }, ScanError>>;
    scanOtherCategories(scanState: CategoryScanState, verify?: boolean): Promise<Result<LedgerHeader | undefined, ScanError>>;
    private verifyOtherCategories;
    private static terminatePool;
    private otherCategoriesExist;
    private createVerificationError;
}
export {};
//# sourceMappingURL=CategoryScanner.d.ts.map