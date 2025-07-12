import { JSONSchemaType } from "ajv";
export interface HistoryArchiveScanV1 {
    readonly url: string;
    readonly startDate: string;
    readonly endDate: string;
    readonly latestVerifiedLedger: number;
    readonly hasError: boolean;
    readonly errorUrl: string | null;
    readonly errorMessage: string | null;
    readonly isSlow: boolean;
}
export declare const HistoryArchiveScanV1Schema: JSONSchemaType<HistoryArchiveScanV1>;
//# sourceMappingURL=history-archive-scan-v1.d.ts.map