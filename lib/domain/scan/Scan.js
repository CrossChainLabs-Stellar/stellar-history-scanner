"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scan = void 0;
const http_helper_1 = require("http-helper");
/**
 * Used to represent a chain of scans for a history url.
 * By grouping the initDate and the url, you get all the scans in a chain. A new initDate starts a new chain for the url.
 * Start and end dates are the times the scan was started and ended for this part of the chain.
 */
class Scan {
    //date where scan for the url was started
    scanChainInitDate;
    startDate;
    endDate;
    baseUrl;
    fromLedger = 0;
    toLedger = null;
    latestScannedLedger = 0;
    latestScannedLedgerHeaderHash = null;
    concurrency = 0;
    isSlowArchive = null;
    error = null;
    scanJobRemoteId = null;
    constructor(scanChainInitDate, startDate, endDate, url, fromLedger, toLedger, latestScannedLedger = 0, latestScannedLedgerHeaderHash = null, concurrency = 0, archiveIsSlow = null, error = null, scanJobRemoteId = null) {
        this.baseUrl = url;
        this.scanChainInitDate = scanChainInitDate;
        this.concurrency = concurrency;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isSlowArchive = archiveIsSlow;
        this.fromLedger = fromLedger;
        this.toLedger = toLedger;
        this.error = error;
        this.latestScannedLedger = latestScannedLedger;
        this.latestScannedLedgerHeaderHash = latestScannedLedgerHeaderHash;
        this.scanJobRemoteId = scanJobRemoteId;
    }
    get url() {
        return this.baseUrl.value;
    }
    set url(value) {
        const baseUrlResult = http_helper_1.Url.create(value);
        if (baseUrlResult.isErr())
            throw baseUrlResult.error;
        this.baseUrl = baseUrlResult.value;
    }
    hasError() {
        return this.error !== null;
    }
    isStartOfScanChain() {
        return this.scanChainInitDate.getTime() === this.startDate.getTime();
    }
    /*
    Last ledger hash is not yet checked with trusted source,
    so we return the previous one that is surely verified through the previous header hash value
    because we verify ledgers in ascending order
     */
    get latestVerifiedLedger() {
        if (this.latestScannedLedger === 0)
            return 0;
        return this.latestScannedLedger - 1;
    }
}
exports.Scan = Scan;
