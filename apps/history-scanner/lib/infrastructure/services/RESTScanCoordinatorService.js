"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESTScanCoordinatorService = exports.CoordinatorServiceError = void 0;
require("reflect-metadata");
const custom_error_1 = require("custom-error");
const http_helper_1 = require("http-helper");
const inversify_1 = require("inversify");
const neverthrow_1 = require("neverthrow");
const history_scanner_dto_1 = require("history-scanner-dto");
const shared_1 = require("shared");
const ScanError_1 = require("../../domain/scan/ScanError");
class CoordinatorServiceError extends custom_error_1.CustomError {
    constructor(message, cause) {
        super(message, CoordinatorServiceError.name, cause);
    }
}
exports.CoordinatorServiceError = CoordinatorServiceError;
let RESTScanCoordinatorService = class RESTScanCoordinatorService {
    httpService;
    coordinatorAPIBaseUrl;
    coordinatorAPIUsername;
    coordinatorAPIPassword;
    constructor(httpService, coordinatorAPIBaseUrl, coordinatorAPIUsername, coordinatorAPIPassword) {
        this.httpService = httpService;
        this.coordinatorAPIBaseUrl = coordinatorAPIBaseUrl;
        this.coordinatorAPIUsername = coordinatorAPIUsername;
        this.coordinatorAPIPassword = coordinatorAPIPassword;
    }
    async registerScan(scan) {
        const urlResult = http_helper_1.Url.create(`${this.coordinatorAPIBaseUrl}/v1/history-scan`);
        if (urlResult.isErr()) {
            return (0, neverthrow_1.err)(new CoordinatorServiceError('Invalid URL', urlResult.error));
        }
        if (scan.scanJobRemoteId === null) {
            return (0, neverthrow_1.err)(new CoordinatorServiceError('Scan job remote ID is null'));
        }
        const scanDTO = this.convertScanToDTO(scan);
        const response = await this.httpService.post(urlResult.value, scanDTO, {
            auth: {
                username: this.coordinatorAPIUsername,
                password: this.coordinatorAPIPassword
            }
        });
        if (response.isErr()) {
            return (0, neverthrow_1.err)(new CoordinatorServiceError('Failed to save scan result', response.error));
        }
        if (response.value.status !== 201) {
            return (0, neverthrow_1.err)(new CoordinatorServiceError('Failed to save scan result'));
        }
        return (0, neverthrow_1.ok)(undefined);
    }
    convertScanToDTO(scan) {
        return {
            baseUrl: scan.baseUrl.value,
            startDate: scan.startDate,
            endDate: scan.endDate,
            scanChainInitDate: scan.scanChainInitDate,
            fromLedger: scan.fromLedger,
            toLedger: scan.toLedger,
            latestVerifiedLedger: scan.latestVerifiedLedger,
            latestScannedLedger: scan.latestScannedLedger,
            latestScannedLedgerHeaderHash: scan.latestScannedLedgerHeaderHash,
            concurrency: scan.concurrency,
            isSlowArchive: scan.isSlowArchive,
            error: scan.error
                ? {
                    message: scan.error.message,
                    type: ScanError_1.ScanErrorType[scan.error.type],
                    url: scan.error.url
                }
                : null,
            scanJobRemoteId: scan.scanJobRemoteId
        };
    }
    async getScanJob() {
        const urlResult = http_helper_1.Url.create(`${this.coordinatorAPIBaseUrl}/v1/history-scan/job`);
        if (urlResult.isErr()) {
            return (0, neverthrow_1.err)(new CoordinatorServiceError('Invalid URL', urlResult.error));
        }
        const response = await this.httpService.get(urlResult.value, {
            auth: {
                username: this.coordinatorAPIUsername,
                password: this.coordinatorAPIPassword
            },
            responseType: 'json'
        });
        if (response.isErr()) {
            return (0, neverthrow_1.err)(new CoordinatorServiceError('Failed to get pending jobs', response.error));
        }
        if (response.value.status !== 200) {
            return (0, neverthrow_1.err)(new CoordinatorServiceError('Failed to get pending jobs'));
        }
        const scanJobJSON = response.value.data;
        if (!(0, shared_1.isObject)(scanJobJSON)) {
            return (0, neverthrow_1.err)(new CoordinatorServiceError('Scan Job JSON must be an object'));
        }
        const scanJobDTOsResult = this.convertResponseToScanJobDTO(scanJobJSON);
        if (scanJobDTOsResult.isErr()) {
            return (0, neverthrow_1.err)(scanJobDTOsResult.error);
        }
        return (0, neverthrow_1.ok)(scanJobDTOsResult.value);
    }
    convertResponseToScanJobDTO(response) {
        const scanJobDTO = history_scanner_dto_1.ScanJobDTO.fromJSON(response);
        if (scanJobDTO.isErr()) {
            return (0, neverthrow_1.err)(new CoordinatorServiceError('Invalid response format'));
        }
        return (0, neverthrow_1.ok)(scanJobDTO.value);
    }
};
exports.RESTScanCoordinatorService = RESTScanCoordinatorService;
exports.RESTScanCoordinatorService = RESTScanCoordinatorService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [Object, String, String, String])
], RESTScanCoordinatorService);
