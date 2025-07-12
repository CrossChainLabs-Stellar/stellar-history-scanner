import { Result } from 'neverthrow';
/**
 * Represents a scan job.
 * A request to scan a specific URL starting from a specific ledger.
 */
export declare class ScanJobDTO {
    readonly url: string;
    readonly latestScannedLedger: number;
    readonly latestScannedLedgerHeaderHash: string | null;
    readonly chainInitDate: Date | null;
    readonly remoteId: string;
    constructor(url: string, latestScannedLedger: number, latestScannedLedgerHeaderHash: string | null, chainInitDate: Date | null, remoteId: string);
    static fromJSON(json: Record<string, unknown>): Result<ScanJobDTO, Error>;
    private static isValidScanJobJSON;
}
//# sourceMappingURL=ScanJobDTO.d.ts.map