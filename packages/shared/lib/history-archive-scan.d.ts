import { HistoryArchiveScanV1 } from "./dto/history-archive-scan-v1";
export declare class HistoryArchiveScan {
    readonly url: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly latestVerifiedLedger: number;
    readonly hasError: boolean;
    readonly errorUrl: string | null;
    readonly errorMessage: string | null;
    readonly isSlow: boolean;
    constructor(url: string, startDate: Date, endDate: Date, latestVerifiedLedger: number, hasError: boolean, errorUrl: string | null, errorMessage: string | null, isSlow: boolean);
    static fromHistoryArchiveScanV1(historyArchiveScanV1DTO: HistoryArchiveScanV1): HistoryArchiveScan;
}
//# sourceMappingURL=history-archive-scan.d.ts.map