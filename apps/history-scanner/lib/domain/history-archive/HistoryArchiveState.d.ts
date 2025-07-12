import { JSONSchemaType } from 'ajv';
export interface HistoryArchiveState {
    version: number;
    server: string;
    currentLedger: number;
    networkPassphrase?: string;
    currentBuckets: {
        curr: string;
        snap: string;
        next: {
            state: number;
            output?: string;
        };
    }[];
}
export declare const HistoryArchiveStateSchema: JSONSchemaType<HistoryArchiveState>;
//# sourceMappingURL=HistoryArchiveState.d.ts.map