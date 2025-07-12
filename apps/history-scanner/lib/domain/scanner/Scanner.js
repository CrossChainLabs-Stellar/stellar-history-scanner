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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
const inversify_1 = require("inversify");
const RangeScanner_1 = require("./RangeScanner");
const ScanSettingsFactory_1 = require("../scan/ScanSettingsFactory");
const di_types_1 = require("../../infrastructure/di/di-types");
let Scanner = class Scanner {
    rangeScanner;
    scanJobSettingsFactory;
    logger;
    exceptionLogger;
    rangeSize;
    constructor(rangeScanner, scanJobSettingsFactory, logger, exceptionLogger, rangeSize = 1000000) {
        this.rangeScanner = rangeScanner;
        this.scanJobSettingsFactory = scanJobSettingsFactory;
        this.logger = logger;
        this.exceptionLogger = exceptionLogger;
        this.rangeSize = rangeSize;
    }
    async perform(time, scanJob) {
        console.time('scan');
        this.logger.info('Starting scan', {
            url: scanJob.url.value,
            isStartOfChain: scanJob.isNewScanChainJob(),
            chainInitDate: scanJob.chainInitDate
        });
        const scanSettingsOrError = await this.scanJobSettingsFactory.determineSettings(scanJob);
        if (scanSettingsOrError.isErr()) {
            const error = scanSettingsOrError.error;
            return scanJob.createFailedScanCouldNotDetermineSettings(time, new Date(), error);
        }
        const scanSettings = scanSettingsOrError.value;
        this.logger.info('Scan settings', {
            url: scanJob.url.value,
            fromLedger: scanSettings.fromLedger,
            toLedger: scanSettings.toLedger,
            concurrency: scanSettings.concurrency,
            isSlowArchive: scanSettings.isSlowArchive
        });
        const scanResult = await this.scanInRanges(scanJob.url, scanSettings);
        const scan = scanJob.createScanFromScanResult(time, new Date(), scanSettings, scanResult);
        console.timeEnd('scan');
        return scan;
    }
    async scanInRanges(url, scanSettings) {
        const latestLedgerHeader = {
            ledger: scanSettings.latestScannedLedger,
            hash: scanSettings.latestScannedLedgerHeaderHash ?? undefined
        };
        let rangeFromLedger = scanSettings.fromLedger; //todo move to range generator
        let rangeToLedger = rangeFromLedger + this.rangeSize < scanSettings.toLedger
            ? rangeFromLedger + this.rangeSize
            : scanSettings.toLedger;
        let alreadyScannedBucketHashes = new Set();
        let error;
        while (rangeFromLedger < scanSettings.toLedger && !error) {
            console.time('range_scan');
            const rangeResult = await this.rangeScanner.scan(url, scanSettings.concurrency, rangeToLedger, rangeFromLedger, latestLedgerHeader.ledger, latestLedgerHeader.hash, alreadyScannedBucketHashes);
            console.timeEnd('range_scan');
            if (rangeResult.isErr()) {
                error = rangeResult.error;
            }
            else {
                latestLedgerHeader.ledger = rangeResult.value.latestLedgerHeader
                    ? rangeResult.value.latestLedgerHeader.ledger
                    : rangeToLedger;
                latestLedgerHeader.hash = rangeResult.value.latestLedgerHeader?.hash;
                alreadyScannedBucketHashes = rangeResult.value.scannedBucketHashes;
                rangeFromLedger += this.rangeSize;
                rangeToLedger =
                    rangeFromLedger + this.rangeSize < scanSettings.toLedger
                        ? rangeFromLedger + this.rangeSize
                        : scanSettings.toLedger;
            }
        }
        return {
            latestLedgerHeader,
            error
        };
    }
};
exports.Scanner = Scanner;
exports.Scanner = Scanner = __decorate([
    (0, inversify_1.injectable)(),
    __param(2, (0, inversify_1.inject)('Logger')),
    __param(3, (0, inversify_1.inject)(di_types_1.TYPES.ExceptionLogger)),
    __metadata("design:paramtypes", [RangeScanner_1.RangeScanner,
        ScanSettingsFactory_1.ScanSettingsFactory, Object, Object, Object])
], Scanner);
