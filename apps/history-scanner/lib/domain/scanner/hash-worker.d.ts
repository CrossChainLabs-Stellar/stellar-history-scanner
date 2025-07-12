export interface LedgerHeaderHistoryEntryResult {
    ledger: number;
    transactionsHash: string;
    transactionResultsHash: string;
    previousLedgerHeaderHash: string;
    ledgerHeaderHash: string;
    bucketListHash: string;
    protocolVersion: number;
}
export declare function processLedgerHeaderHistoryEntryXDR(ledgerHeaderHistoryEntryXDR: Buffer | Uint8Array): LedgerHeaderHistoryEntryResult;
export declare function processTransactionHistoryResultEntryXDR(transactionHistoryResultXDR: Buffer | Uint8Array): {
    ledger: number;
    hash: string;
};
export declare function processTransactionHistoryEntryXDR(transactionHistoryEntryXDR: Uint8Array): {
    ledger: number;
    hash: string;
};
//# sourceMappingURL=hash-worker.d.ts.map