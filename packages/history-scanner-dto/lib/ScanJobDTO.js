"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanJobDTO = void 0;
const neverthrow_1 = require("neverthrow");
/**
 * Represents a scan job.
 * A request to scan a specific URL starting from a specific ledger.
 */
class ScanJobDTO {
    url;
    latestScannedLedger;
    latestScannedLedgerHeaderHash;
    chainInitDate;
    remoteId;
    constructor(url, latestScannedLedger, latestScannedLedgerHeaderHash, chainInitDate, remoteId) {
        this.url = url;
        this.latestScannedLedger = latestScannedLedger;
        this.latestScannedLedgerHeaderHash = latestScannedLedgerHeaderHash;
        this.chainInitDate = chainInitDate;
        this.remoteId = remoteId;
    }
    static fromJSON(json) {
        if (!this.isValidScanJobJSON(json)) {
            return (0, neverthrow_1.err)(new Error('Invalid ScanJobDTO JSON format'));
        }
        return (0, neverthrow_1.ok)(new ScanJobDTO(json.url, json.latestScannedLedger, json.latestScannedLedgerHeaderHash, json.chainInitDate ? new Date(json.chainInitDate) : null, json.remoteId));
    }
    static isValidScanJobJSON(json) {
        return (typeof json === 'object' &&
            json !== null &&
            typeof json.url === 'string' &&
            typeof json.latestScannedLedger === 'number' &&
            Number.isInteger(json.latestScannedLedger) &&
            (json.latestScannedLedgerHeaderHash === null ||
                typeof json.latestScannedLedgerHeaderHash === 'string') &&
            (json.chainInitDate === null ||
                (typeof json.chainInitDate === 'string' &&
                    !isNaN(new Date(json.chainInitDate).getTime()))) &&
            typeof json.remoteId === 'string');
    }
}
exports.ScanJobDTO = ScanJobDTO;
