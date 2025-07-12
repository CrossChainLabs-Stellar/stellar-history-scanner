"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanJob = void 0;
const http_helper_1 = require("http-helper");
const Scan_1 = require("./Scan");
const neverthrow_1 = require("neverthrow");
//a scheduled scan with optional settings. Has no start and end time yet.
class ScanJob {
    url;
    latestScannedLedger;
    latestScannedLedgerHeaderHash;
    chainInitDate;
    fromLedger;
    toLedger;
    concurrency;
    remoteId;
    constructor(url, latestScannedLedger = 0, latestScannedLedgerHeaderHash = null, chainInitDate = null, fromLedger = 0, toLedger = null, concurrency = 0, remoteId = null) {
        this.url = url;
        this.latestScannedLedger = latestScannedLedger;
        this.latestScannedLedgerHeaderHash = latestScannedLedgerHeaderHash;
        this.chainInitDate = chainInitDate;
        this.fromLedger = fromLedger;
        this.toLedger = toLedger;
        this.concurrency = concurrency;
        this.remoteId = remoteId;
    }
    static fromScanJobCoordinatorDTO(dto) {
        const urlResult = http_helper_1.Url.create(dto.url);
        if (urlResult.isErr()) {
            return (0, neverthrow_1.err)(urlResult.error);
        }
        return (0, neverthrow_1.ok)(new ScanJob(urlResult.value, dto.latestScannedLedger, dto.latestScannedLedgerHeaderHash, dto.chainInitDate, dto.latestScannedLedger > 0 ? dto.latestScannedLedger + 1 : 0, null, 0, dto.remoteId));
    }
    static continueScanChain(previousScan, toLedger = null, concurrency = 0) {
        return new ScanJob(previousScan.baseUrl, previousScan.latestScannedLedger, previousScan.latestScannedLedgerHeaderHash, previousScan.scanChainInitDate, previousScan.latestScannedLedger + 1, toLedger, concurrency);
    }
    static newScanChain(url, fromLedger = 0, toLedger = null, concurrency = 0) {
        return new ScanJob(url, 0, null, null, fromLedger, toLedger, concurrency);
    }
    isNewScanChainJob() {
        return this.chainInitDate === null;
    }
    createFailedScanCouldNotDetermineSettings(startDate, endDate, error) {
        return new Scan_1.Scan(this.chainInitDate ?? startDate, startDate, endDate, this.url, this.fromLedger, this.toLedger, this.latestScannedLedger, this.latestScannedLedgerHeaderHash, this.concurrency, null, error, this.remoteId);
    }
    createScanFromScanResult(startDate, endDate, settings, scanResult) {
        return new Scan_1.Scan(this.chainInitDate ?? startDate, startDate, endDate, this.url, settings.fromLedger, settings.toLedger, scanResult.latestLedgerHeader.ledger, scanResult.latestLedgerHeader.hash, settings.concurrency, settings.isSlowArchive, scanResult.error, this.remoteId);
    }
}
exports.ScanJob = ScanJob;
