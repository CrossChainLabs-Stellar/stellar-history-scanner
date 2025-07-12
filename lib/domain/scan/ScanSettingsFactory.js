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
var ScanSettingsFactory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanSettingsFactory = void 0;
require("reflect-metadata");
const ScanError_1 = require("./ScanError");
const inversify_1 = require("inversify");
const neverthrow_1 = require("neverthrow");
const CategoryScanner_1 = require("../scanner/CategoryScanner");
const ArchivePerformanceTester_1 = require("../scanner/ArchivePerformanceTester");
let ScanSettingsFactory = ScanSettingsFactory_1 = class ScanSettingsFactory {
    categoryScanner;
    archivePerformanceTester;
    slowArchiveMaxNumberOfLedgersToScan;
    constructor(categoryScanner, archivePerformanceTester, slowArchiveMaxNumberOfLedgersToScan = 120960 //by default only scan the latest week worth of ledgers for slow archives (5sec ledger close time)
    ) {
        this.categoryScanner = categoryScanner;
        this.archivePerformanceTester = archivePerformanceTester;
        this.slowArchiveMaxNumberOfLedgersToScan = slowArchiveMaxNumberOfLedgersToScan;
    }
    async determineSettings(scanJob) {
        const toLedgerResult = await this.determineToLedger(scanJob);
        if (toLedgerResult.isErr()) {
            return (0, neverthrow_1.err)(toLedgerResult.error);
        }
        const toLedger = toLedgerResult.value;
        const concurrencyResult = await this.determineConcurrencyAndSlowArchive(scanJob, toLedger);
        if (concurrencyResult.isErr()) {
            return (0, neverthrow_1.err)(concurrencyResult.error);
        }
        const concurrency = concurrencyResult.value.concurrency;
        const isSlowArchive = concurrencyResult.value.isSlowArchive;
        const fromLedger = this.determineFromLedger(scanJob, toLedger, isSlowArchive);
        const latestLedgerHeader = this.determineLatestLedgerHeader(scanJob, toLedger, isSlowArchive);
        return (0, neverthrow_1.ok)(ScanSettingsFactory_1.createScanSettings(scanJob, toLedger, concurrency, isSlowArchive, fromLedger, latestLedgerHeader.ledger, latestLedgerHeader.hash));
    }
    static createScanSettings(scanJob, toLedger, concurrency, isSlowArchive, fromLedger, latestLedgerHeaderLedger, latestLedgerHeaderHash) {
        return {
            fromLedger: fromLedger ?? scanJob.fromLedger,
            toLedger: toLedger ?? scanJob.toLedger ?? 0,
            concurrency: concurrency ?? scanJob.concurrency,
            isSlowArchive: isSlowArchive ?? null,
            latestScannedLedger: latestLedgerHeaderLedger ?? scanJob.latestScannedLedger,
            latestScannedLedgerHeaderHash: latestLedgerHeaderHash !== undefined //careful because it could be null
                ? latestLedgerHeaderHash
                : scanJob.latestScannedLedgerHeaderHash
        };
    }
    async determineConcurrencyAndSlowArchive(scanJob, toLedger) {
        if (scanJob.concurrency !== 0) {
            return (0, neverthrow_1.ok)({
                concurrency: scanJob.concurrency,
                isSlowArchive: null
            });
        }
        console.log('determining optimal concurrency');
        const performanceTestResultOrError = await this.archivePerformanceTester.test(scanJob.url, toLedger);
        if (performanceTestResultOrError.isErr())
            return (0, neverthrow_1.err)(new ScanError_1.ScanError(ScanError_1.ScanErrorType.TYPE_CONNECTION, scanJob.url.value, 'Could not connect to determine optimal concurrency'));
        console.log(performanceTestResultOrError);
        return (0, neverthrow_1.ok)({
            concurrency: performanceTestResultOrError.value.optimalConcurrency,
            isSlowArchive: performanceTestResultOrError.value.isSlowArchive
        });
    }
    determineLatestLedgerHeader(scanJob, toLedger, isSlowArchive) {
        if (isSlowArchive &&
            this.slowArchiveExceedsMaxLedgersToScan(toLedger, scanJob))
            return {
                ledger: 0,
                hash: null
            };
        return {
            ledger: scanJob.latestScannedLedger,
            hash: scanJob.latestScannedLedgerHeaderHash
        };
    }
    determineFromLedger(scanJob, toLedger, isSlowArchive) {
        if (isSlowArchive)
            return this.slowArchiveExceedsMaxLedgersToScan(toLedger, scanJob)
                ? toLedger - this.slowArchiveMaxNumberOfLedgersToScan
                : scanJob.fromLedger;
        return scanJob.fromLedger;
    }
    slowArchiveExceedsMaxLedgersToScan(toLedger, scanJob) {
        return (toLedger - scanJob.fromLedger >= this.slowArchiveMaxNumberOfLedgersToScan);
    }
    async determineToLedger(scanJob) {
        if (scanJob.toLedger !== null) {
            return (0, neverthrow_1.ok)(scanJob.toLedger);
        }
        const latestLedgerOrError = await this.categoryScanner.findLatestLedger(scanJob.url);
        if (latestLedgerOrError.isErr()) {
            return (0, neverthrow_1.err)(new ScanError_1.ScanError(ScanError_1.ScanErrorType.TYPE_CONNECTION, scanJob.url.value, 'Could not fetch latest ledger'));
        }
        return (0, neverthrow_1.ok)(latestLedgerOrError.value);
    }
};
ScanSettingsFactory = ScanSettingsFactory_1 = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [CategoryScanner_1.CategoryScanner,
        ArchivePerformanceTester_1.ArchivePerformanceTester, Object])
], ScanSettingsFactory);
exports.ScanSettingsFactory = ScanSettingsFactory;
