import { Result } from 'neverthrow';
import { ScanErrorDTO } from 'src';
/**
 * Represents a finished scan.
 */
export declare class ScanDTO {
    readonly startDate: Date;
    readonly endDate: Date;
    readonly baseUrl: string;
    readonly scanChainInitDate: Date;
    readonly fromLedger: number;
    readonly toLedger: number | null;
    readonly latestVerifiedLedger: number;
    readonly latestScannedLedger: number;
    readonly latestScannedLedgerHeaderHash: string | null;
    readonly concurrency: number;
    readonly isSlowArchive: boolean | null;
    readonly error: ScanErrorDTO | null;
    readonly scanJobRemoteId: string;
    constructor(startDate: Date, endDate: Date, baseUrl: string, scanChainInitDate: Date, fromLedger: number, toLedger: number | null, latestVerifiedLedger: number, latestScannedLedger: number, latestScannedLedgerHeaderHash: string | null, concurrency: number, isSlowArchive: boolean | null, error: ScanErrorDTO | null, scanJobRemoteId: string);
    static fromJSON(json: Record<string, unknown>): Result<ScanDTO, Error>;
    private static isValidScanJSON;
    private static isValidScanErrorDTO;
}
//# sourceMappingURL=ScanDTO.d.ts.map