"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanDTO = void 0;
const neverthrow_1 = require("neverthrow");
/**
 * Represents a finished scan.
 */
class ScanDTO {
    startDate;
    endDate;
    baseUrl;
    scanChainInitDate;
    fromLedger;
    toLedger;
    latestVerifiedLedger;
    latestScannedLedger;
    latestScannedLedgerHeaderHash;
    concurrency;
    isSlowArchive;
    error;
    scanJobRemoteId;
    constructor(startDate, endDate, baseUrl, scanChainInitDate, fromLedger, toLedger, latestVerifiedLedger, latestScannedLedger, latestScannedLedgerHeaderHash, concurrency, isSlowArchive, error, scanJobRemoteId) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.baseUrl = baseUrl;
        this.scanChainInitDate = scanChainInitDate;
        this.fromLedger = fromLedger;
        this.toLedger = toLedger;
        this.latestVerifiedLedger = latestVerifiedLedger;
        this.latestScannedLedger = latestScannedLedger;
        this.latestScannedLedgerHeaderHash = latestScannedLedgerHeaderHash;
        this.concurrency = concurrency;
        this.isSlowArchive = isSlowArchive;
        this.error = error;
        this.scanJobRemoteId = scanJobRemoteId;
    }
    static fromJSON(json) {
        if (!this.isValidScanJSON(json)) {
            return (0, neverthrow_1.err)(new Error('Invalid ScanDTO JSON format'));
        }
        return (0, neverthrow_1.ok)(new ScanDTO(new Date(json.startDate), new Date(json.endDate), json.baseUrl, new Date(json.scanChainInitDate), json.fromLedger, json.toLedger, json.latestVerifiedLedger, json.latestScannedLedger, json.latestScannedLedgerHeaderHash, json.concurrency, json.isSlowArchive, json.error, json.scanJobRemoteId));
    }
    static isValidScanJSON(json) {
        return (typeof json === 'object' &&
            json !== null &&
            typeof json.startDate === 'string' &&
            !isNaN(new Date(json.startDate).getTime()) &&
            typeof json.endDate === 'string' &&
            !isNaN(new Date(json.endDate).getTime()) &&
            typeof json.baseUrl === 'string' &&
            typeof json.scanChainInitDate === 'string' &&
            !isNaN(new Date(json.scanChainInitDate).getTime()) &&
            typeof json.fromLedger === 'number' &&
            Number.isInteger(json.fromLedger) &&
            (json.toLedger === null || Number.isInteger(json.toLedger)) &&
            typeof json.latestVerifiedLedger === 'number' &&
            Number.isInteger(json.latestVerifiedLedger) &&
            typeof json.latestScannedLedger === 'number' &&
            Number.isInteger(json.latestScannedLedger) &&
            (json.latestScannedLedgerHeaderHash === null ||
                typeof json.latestScannedLedgerHeaderHash === 'string') &&
            typeof json.concurrency === 'number' &&
            Number.isInteger(json.concurrency) &&
            (json.isSlowArchive === null ||
                typeof json.isSlowArchive === 'boolean') &&
            (json.error === null || this.isValidScanErrorDTO(json.error)) &&
            typeof json.scanJobRemoteId === 'string');
    }
    static isValidScanErrorDTO(error) {
        return (typeof error === 'object' &&
            error !== null &&
            typeof error.type === 'string' &&
            typeof error.url === 'string' &&
            typeof error.message === 'string');
    }
}
exports.ScanDTO = ScanDTO;
