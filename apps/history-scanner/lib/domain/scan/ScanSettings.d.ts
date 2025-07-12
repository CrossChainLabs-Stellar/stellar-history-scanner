export interface ScanSettings {
    readonly fromLedger: number;
    readonly toLedger: number;
    readonly concurrency: number;
    readonly isSlowArchive: boolean | null;
    readonly latestScannedLedger: number;
    readonly latestScannedLedgerHeaderHash: string | null;
}
//# sourceMappingURL=ScanSettings.d.ts.map