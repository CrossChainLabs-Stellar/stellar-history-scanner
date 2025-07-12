"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryScanState = exports.BucketScanState = exports.ScanState = void 0;
class ScanState {
    baseUrl;
    concurrency;
    httpAgent;
    httpsAgent;
    constructor(baseUrl, concurrency, httpAgent, httpsAgent) {
        this.baseUrl = baseUrl;
        this.concurrency = concurrency;
        this.httpAgent = httpAgent;
        this.httpsAgent = httpsAgent;
    }
}
exports.ScanState = ScanState;
class BucketScanState extends ScanState {
    baseUrl;
    concurrency;
    httpAgent;
    httpsAgent;
    bucketHashesToScan;
    constructor(baseUrl, concurrency, httpAgent, httpsAgent, bucketHashesToScan) {
        super(baseUrl, concurrency, httpAgent, httpsAgent);
        this.baseUrl = baseUrl;
        this.concurrency = concurrency;
        this.httpAgent = httpAgent;
        this.httpsAgent = httpsAgent;
        this.bucketHashesToScan = bucketHashesToScan;
    }
}
exports.BucketScanState = BucketScanState;
class CategoryScanState extends ScanState {
    baseUrl;
    concurrency;
    httpAgent;
    httpsAgent;
    checkPoints;
    bucketListHashes;
    previousLedgerHeader;
    constructor(baseUrl, concurrency, httpAgent, httpsAgent, checkPoints, bucketListHashes, previousLedgerHeader) {
        super(baseUrl, concurrency, httpAgent, httpsAgent);
        this.baseUrl = baseUrl;
        this.concurrency = concurrency;
        this.httpAgent = httpAgent;
        this.httpsAgent = httpsAgent;
        this.checkPoints = checkPoints;
        this.bucketListHashes = bucketListHashes;
        this.previousLedgerHeader = previousLedgerHeader;
    }
}
exports.CategoryScanState = CategoryScanState;
