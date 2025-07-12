/// <reference types="node" />
/// <reference types="node" />
import { Url } from 'http-helper';
import * as http from 'http';
import * as https from 'https';
import { LedgerHeader } from './Scanner';
export declare abstract class ScanState {
    readonly baseUrl: Url;
    readonly concurrency: number;
    readonly httpAgent: http.Agent;
    readonly httpsAgent: https.Agent;
    protected constructor(baseUrl: Url, concurrency: number, httpAgent: http.Agent, httpsAgent: https.Agent);
}
export declare class BucketScanState extends ScanState {
    readonly baseUrl: Url;
    readonly concurrency: number;
    readonly httpAgent: http.Agent;
    readonly httpsAgent: https.Agent;
    bucketHashesToScan: Set<string>;
    constructor(baseUrl: Url, concurrency: number, httpAgent: http.Agent, httpsAgent: https.Agent, bucketHashesToScan: Set<string>);
}
export declare class CategoryScanState extends ScanState {
    readonly baseUrl: Url;
    readonly concurrency: number;
    readonly httpAgent: http.Agent;
    readonly httpsAgent: https.Agent;
    readonly checkPoints: IterableIterator<number>;
    readonly bucketListHashes: Map<number, string>;
    readonly previousLedgerHeader?: LedgerHeader | undefined;
    constructor(baseUrl: Url, concurrency: number, httpAgent: http.Agent, httpsAgent: https.Agent, checkPoints: IterableIterator<number>, bucketListHashes: Map<number, string>, previousLedgerHeader?: LedgerHeader | undefined);
}
//# sourceMappingURL=ScanState.d.ts.map