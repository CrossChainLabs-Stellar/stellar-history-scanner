"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangeScanner = void 0;
const CheckPointGenerator_1 = require("../check-point/CheckPointGenerator");
const inversify_1 = require("inversify");
const neverthrow_1 = require("neverthrow");
const ScanState_1 = require("./ScanState");
const http_helper_1 = require("http-helper");
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const CategoryScanner_1 = require("./CategoryScanner");
const BucketScanner_1 = require("./BucketScanner");
const di_types_1 = require("../../infrastructure/di/di-types");
const logger_1 = require("./logger");
/**
 * Scan a specific range of a history archive
 */
let RangeScanner = class RangeScanner {
    checkPointGenerator;
    categoryScanner;
    bucketScanner;
    httpQueue;
    logger;
    exceptionLogger;
    constructor(checkPointGenerator, categoryScanner, bucketScanner, httpQueue, logger, exceptionLogger) {
        this.checkPointGenerator = checkPointGenerator;
        this.categoryScanner = categoryScanner;
        this.bucketScanner = bucketScanner;
        this.httpQueue = httpQueue;
        this.logger = logger;
        this.exceptionLogger = exceptionLogger;
    }
    async scan(baseUrl, concurrency, toLedger, fromLedger, latestScannedLedger, latestScannedLedgerHeaderHash = null, alreadyScannedBucketHashes = new Set()) {
        (0, logger_1.logWithTimestamp)('Range [', fromLedger, ':', toLedger, ']');
        const httpAgent = new http.Agent({
            keepAlive: true,
            scheduling: 'fifo'
        });
        const httpsAgent = new https.Agent({
            keepAlive: true,
            scheduling: 'fifo'
        });
        const hasScanState = new ScanState_1.CategoryScanState(baseUrl, concurrency, httpAgent, httpsAgent, this.checkPointGenerator.generate(fromLedger, toLedger), new Map(), latestScannedLedgerHeaderHash !== null
            ? {
                ledger: latestScannedLedger,
                hash: latestScannedLedgerHeaderHash
            }
            : undefined);
        const bucketHashesOrError = await this.scanHASFilesAndReturnBucketHashes(hasScanState);
        if (bucketHashesOrError.isErr())
            return (0, neverthrow_1.err)(bucketHashesOrError.error);
        const bucketHashesToScan = bucketHashesOrError.value.bucketHashes;
        const categoryScanState = new ScanState_1.CategoryScanState(baseUrl, concurrency, httpAgent, httpsAgent, this.checkPointGenerator.generate(fromLedger, toLedger), bucketHashesOrError.value.bucketListHashes, latestScannedLedgerHeaderHash
            ? {
                ledger: latestScannedLedger,
                hash: latestScannedLedgerHeaderHash
            }
            : undefined);
        const categoryScanResult = await this.scanCategories(categoryScanState);
        if (categoryScanResult.isErr())
            return (0, neverthrow_1.err)(categoryScanResult.error);
        const bucketScanState = new ScanState_1.BucketScanState(baseUrl, concurrency, httpAgent, httpsAgent, new Set(Array.from(bucketHashesToScan).filter((hashToScan) => !alreadyScannedBucketHashes.has(hashToScan))));
        const bucketScanResult = await this.scanBucketFiles(bucketScanState);
        if (bucketScanResult.isErr())
            return (0, neverthrow_1.err)(bucketScanResult.error);
        httpAgent.destroy();
        httpsAgent.destroy();
        return (0, neverthrow_1.ok)({
            latestLedgerHeader: categoryScanResult.value,
            scannedBucketHashes: new Set([
                ...bucketScanState.bucketHashesToScan,
                ...alreadyScannedBucketHashes
            ])
        });
    }
    async scanHASFilesAndReturnBucketHashes(scanState) {
        (0, logger_1.logWithTimestamp)('Scanning HAS files');
        const scanHASResult = await this.categoryScanner.scanHASFilesAndReturnBucketHashes(scanState);
        if (scanHASResult.isErr()) {
            return (0, neverthrow_1.err)(scanHASResult.error);
        }
        return (0, neverthrow_1.ok)(scanHASResult.value);
    }
    async scanBucketFiles(scanState) {
        (0, logger_1.logWithTimestamp)('Scanning', scanState.bucketHashesToScan.size, 'buckets');
        const scanBucketsResult = await this.bucketScanner.scan(scanState, true);
        return scanBucketsResult;
    }
    async scanCategories(scanState) {
        (0, logger_1.logWithTimestamp)('Scanning other category files');
        const scanOtherCategoriesResult = await this.categoryScanner.scanOtherCategories(scanState, true);
        return scanOtherCategoriesResult;
    }
};
exports.RangeScanner = RangeScanner;
exports.RangeScanner = RangeScanner = __decorate([
    (0, inversify_1.injectable)(),
    __param(3, (0, inversify_1.inject)(di_types_1.TYPES.HttpQueue)),
    __param(4, (0, inversify_1.inject)('Logger')),
    __param(5, (0, inversify_1.inject)(di_types_1.TYPES.ExceptionLogger)),
    __metadata("design:paramtypes", [CheckPointGenerator_1.CheckPointGenerator,
        CategoryScanner_1.CategoryScanner,
        BucketScanner_1.BucketScanner,
        http_helper_1.HttpQueue, Object, Object])
], RangeScanner);
