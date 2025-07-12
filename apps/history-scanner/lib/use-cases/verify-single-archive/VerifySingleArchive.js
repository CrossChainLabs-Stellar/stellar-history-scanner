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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var VerifySingleArchive_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifySingleArchive = void 0;
const inversify_1 = require("inversify");
const neverthrow_1 = require("neverthrow");
const Scanner_1 = require("../../domain/scanner/Scanner");
const shared_1 = require("shared");
const ScanJob_1 = require("../../domain/scan/ScanJob");
const http_helper_1 = require("http-helper");
const di_types_1 = require("../../infrastructure/di/di-types");
let VerifySingleArchive = VerifySingleArchive_1 = class VerifySingleArchive {
    scanner;
    exceptionLogger;
    constructor(scanner, exceptionLogger) {
        this.scanner = scanner;
        this.exceptionLogger = exceptionLogger;
    }
    async execute(verifySingleArchiveDTO) {
        try {
            const historyArchiveOrError = await VerifySingleArchive_1.getArchiveUrl(verifySingleArchiveDTO.historyUrl);
            if (historyArchiveOrError.isErr()) {
                //stop the script
                this.exceptionLogger.captureException(historyArchiveOrError.error);
                return (0, neverthrow_1.err)(historyArchiveOrError.error);
            }
            await this.scanArchive(historyArchiveOrError.value, verifySingleArchiveDTO.fromLedger, verifySingleArchiveDTO.toLedger, verifySingleArchiveDTO.maxConcurrency);
        }
        catch (e) {
            this.exceptionLogger.captureException((0, shared_1.mapUnknownToError)(e));
        }
        return (0, neverthrow_1.ok)(undefined);
    }
    static async getArchiveUrl(historyUrl) {
        const historyBaseUrl = http_helper_1.Url.create(historyUrl);
        if (historyBaseUrl.isErr()) {
            return (0, neverthrow_1.err)(historyBaseUrl.error);
        }
        return (0, neverthrow_1.ok)(historyBaseUrl.value);
    }
    async scanArchive(archive, fromLedger, toLedger, concurrency) {
        const scanJob = ScanJob_1.ScanJob.newScanChain(archive, fromLedger, toLedger, concurrency);
        const scan = await this.scanner.perform(new Date(), scanJob);
        console.log(scan);
    }
};
exports.VerifySingleArchive = VerifySingleArchive;
exports.VerifySingleArchive = VerifySingleArchive = VerifySingleArchive_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(1, (0, inversify_1.inject)(di_types_1.TYPES.ExceptionLogger)),
    __metadata("design:paramtypes", [Scanner_1.Scanner, Object])
], VerifySingleArchive);
