"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryArchiveScan = void 0;
class HistoryArchiveScan {
    url;
    startDate;
    endDate;
    latestVerifiedLedger;
    hasError;
    errorUrl;
    errorMessage;
    isSlow;
    constructor(url, startDate, endDate, latestVerifiedLedger, hasError, errorUrl, errorMessage, isSlow) {
        this.url = url;
        this.startDate = startDate;
        this.endDate = endDate;
        this.latestVerifiedLedger = latestVerifiedLedger;
        this.hasError = hasError;
        this.errorUrl = errorUrl;
        this.errorMessage = errorMessage;
        this.isSlow = isSlow;
    }
    static fromHistoryArchiveScanV1(historyArchiveScanV1DTO) {
        return new HistoryArchiveScan(historyArchiveScanV1DTO.url, new Date(historyArchiveScanV1DTO.startDate), new Date(historyArchiveScanV1DTO.endDate), historyArchiveScanV1DTO.latestVerifiedLedger, historyArchiveScanV1DTO.hasError, historyArchiveScanV1DTO.errorUrl, historyArchiveScanV1DTO.errorMessage, historyArchiveScanV1DTO.isSlow);
    }
}
exports.HistoryArchiveScan = HistoryArchiveScan;
