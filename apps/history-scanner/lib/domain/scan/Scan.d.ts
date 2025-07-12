import { Url } from 'http-helper';
import { ScanError } from './ScanError';
/**
 * Used to represent a chain of scans for a history url.
 * By grouping the initDate and the url, you get all the scans in a chain. A new initDate starts a new chain for the url.
 * Start and end dates are the times the scan was started and ended for this part of the chain.
 */
export declare class Scan {
    readonly scanChainInitDate: Date;
    readonly startDate: Date;
    readonly endDate: Date;
    baseUrl: Url;
    readonly fromLedger: number;
    readonly toLedger: number | null;
    readonly latestScannedLedger: number;
    readonly latestScannedLedgerHeaderHash: string | null;
    readonly concurrency: number;
    readonly isSlowArchive: boolean | null;
    readonly error: ScanError | null;
    readonly scanJobRemoteId: string | null;
    constructor(scanChainInitDate: Date, startDate: Date, endDate: Date, url: Url, fromLedger: number, toLedger: number | null, latestScannedLedger?: number, latestScannedLedgerHeaderHash?: string | null, concurrency?: number, archiveIsSlow?: boolean | null, error?: ScanError | null, scanJobRemoteId?: string | null);
    private get url();
    private set url(value);
    hasError(): boolean;
    isStartOfScanChain(): boolean;
    get latestVerifiedLedger(): number;
}
//# sourceMappingURL=Scan.d.ts.map