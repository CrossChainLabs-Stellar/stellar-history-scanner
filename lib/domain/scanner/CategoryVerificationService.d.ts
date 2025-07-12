import { CategoryVerificationData, ExpectedHashes } from './CategoryScanner';
import { Category } from '../history-archive/Category';
import { Result } from 'neverthrow';
import { CheckPointFrequency } from '../check-point/CheckPointFrequency';
import { LedgerHeader } from './Scanner';
interface VerificationError {
    ledger: number;
    category: Category;
    message: string;
}
export declare class CategoryVerificationService {
    verify(categoryVerificationData: CategoryVerificationData, bucketListHashes: Map<number, string>, checkPointFrequency: CheckPointFrequency, initialPreviousLedgerHeader?: LedgerHeader): Result<void, VerificationError>;
    private verifyLedgerData;
    private static getLowestLedger;
    verifyTransactionResults(ledger: number, categoryVerificationData: CategoryVerificationData, expectedHashes: ExpectedHashes): boolean;
    verifyBucketListHash(ledger: number, checkPointFrequency: CheckPointFrequency, expectedHashes: ExpectedHashes, bucketListHashes: Map<number, string>): boolean;
    verifyLedgerHeaders(ledger: number, categoryVerificationData: CategoryVerificationData, expectedHashes: ExpectedHashes, lowestLedger: number, initialPreviousLedgerHeader?: LedgerHeader): boolean;
    verifyTransactions(ledger: number, categoryVerificationData: CategoryVerificationData, expectedHashes: ExpectedHashes): boolean;
}
export {};
//# sourceMappingURL=CategoryVerificationService.d.ts.map