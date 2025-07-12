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
var CategoryScanner_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryScanner = void 0;
const stream = __importStar(require("stream"));
const neverthrow_1 = require("neverthrow");
const RequestGenerator_1 = require("./RequestGenerator");
const http_helper_1 = require("http-helper");
const HASValidator_1 = require("../history-archive/HASValidator");
const inversify_1 = require("inversify");
const HASBucketHashExtractor_1 = require("../history-archive/HASBucketHashExtractor");
const mapHttpQueueErrorToScanError_1 = require("./mapHttpQueueErrorToScanError");
const shared_1 = require("shared");
const zlib_1 = require("zlib");
const XdrStreamReader_1 = require("./XdrStreamReader");
const promises_1 = require("stream/promises");
const CategoryXDRProcessor_1 = require("./CategoryXDRProcessor");
const ScanError_1 = require("../scan/ScanError");
const UrlBuilder_1 = require("../history-archive/UrlBuilder");
const CheckPointGenerator_1 = require("../check-point/CheckPointGenerator");
const hashBucketList_1 = require("../history-archive/hashBucketList");
const WorkerPoolLoadTracker_1 = require("./WorkerPoolLoadTracker");
const CategoryVerificationService_1 = require("./CategoryVerificationService");
const HasherPool_1 = require("./HasherPool");
const isZLibError_1 = require("./isZLibError");
const getMaximumNumber_1 = require("./getMaximumNumber");
const di_types_1 = require("./../../infrastructure/di/di-types");
let CategoryScanner = class CategoryScanner {
    static { CategoryScanner_1 = this; }
    hasValidator;
    httpQueue;
    checkPointGenerator;
    categoryVerificationService;
    static ZeroXdrHash = '3z9hmASpL9tAVxktxD3XSOp3itxSvEmM6AUkwBS4ERk=';
    static ZeroHash = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
    static POOL_MAX_PENDING_TASKS = 20000;
    constructor(hasValidator, httpQueue, checkPointGenerator, categoryVerificationService) {
        this.hasValidator = hasValidator;
        this.httpQueue = httpQueue;
        this.checkPointGenerator = checkPointGenerator;
        this.categoryVerificationService = categoryVerificationService;
    }
    async findLatestLedger(baseUrl) {
        const rootHASUrl = UrlBuilder_1.UrlBuilder.getRootHASUrl(baseUrl);
        const rootHASUrlRequest = [
            {
                url: rootHASUrl,
                method: http_helper_1.RequestMethod.GET,
                meta: {}
            }
        ];
        let ledger;
        const successOrError = await this.httpQueue.sendRequests(rootHASUrlRequest[Symbol.iterator](), {
            stallTimeMs: 150,
            concurrency: 1,
            nrOfRetries: 6, //last retry is after 1 min wait. 2 minute total wait time
            rampUpConnections: true,
            httpOptions: {
                responseType: 'json',
                socketTimeoutMs: 4000 //timeout to download file
            }
        }, async (result, request) => {
            if (!(0, shared_1.isObject)(result)) {
                return (0, neverthrow_1.err)(new http_helper_1.FileNotFoundError(request));
            }
            const validateHASResult = this.hasValidator.validate(result);
            if (validateHASResult.isOk()) {
                ledger = validateHASResult.value.currentLedger;
                return (0, neverthrow_1.ok)(undefined);
            }
            else {
                return (0, neverthrow_1.err)(new http_helper_1.QueueError(request, validateHASResult.error));
            }
        });
        if (successOrError.isErr()) {
            return (0, neverthrow_1.err)((0, mapHttpQueueErrorToScanError_1.mapHttpQueueErrorToScanError)(successOrError.error));
        }
        if (!ledger) {
            return (0, neverthrow_1.err)(new ScanError_1.ScanError(ScanError_1.ScanErrorType.TYPE_VERIFICATION, rootHASUrl.value, 'No latest ledger found'));
        }
        return (0, neverthrow_1.ok)(ledger);
    }
    //fetches all HAS files in checkpoint range and returns all detected bucket urls
    async scanHASFilesAndReturnBucketHashes(scanState, verify = true) {
        const historyArchiveStateURLGenerator = RequestGenerator_1.RequestGenerator.generateHASRequests(scanState.baseUrl, scanState.checkPoints, http_helper_1.RequestMethod.GET);
        const bucketHashes = new Set();
        const successOrError = await this.httpQueue.sendRequests(historyArchiveStateURLGenerator, {
            stallTimeMs: 150,
            concurrency: scanState.concurrency,
            nrOfRetries: 6, //last retry is after 1 min wait. 2 minute total wait time
            rampUpConnections: true,
            httpOptions: {
                httpAgent: scanState.httpAgent,
                httpsAgent: scanState.httpsAgent,
                responseType: 'json',
                socketTimeoutMs: 4000 //timeout to download file
            }
        }, async (result, request) => {
            if (!(0, shared_1.isObject)(result)) {
                return (0, neverthrow_1.err)(new http_helper_1.FileNotFoundError(request));
            }
            const validateHASResult = this.hasValidator.validate(result);
            if (validateHASResult.isOk()) {
                HASBucketHashExtractor_1.HASBucketHashExtractor.getNonZeroHashes(validateHASResult.value).forEach((hash) => bucketHashes.add(hash));
                if (verify) {
                    const bucketListHashResult = (0, hashBucketList_1.hashBucketList)(validateHASResult.value);
                    if (bucketListHashResult.isOk())
                        scanState.bucketListHashes.set(bucketListHashResult.value.ledger, bucketListHashResult.value.hash);
                }
                return (0, neverthrow_1.ok)(undefined);
            }
            else {
                return (0, neverthrow_1.err)(new http_helper_1.QueueError(request, validateHASResult.error));
            }
        });
        if (successOrError.isErr()) {
            return (0, neverthrow_1.err)((0, mapHttpQueueErrorToScanError_1.mapHttpQueueErrorToScanError)(successOrError.error));
        }
        return (0, neverthrow_1.ok)({
            bucketHashes: bucketHashes,
            bucketListHashes: scanState.bucketListHashes
        });
    }
    async scanOtherCategories(scanState, verify = false) {
        if (!verify)
            return await this.otherCategoriesExist(scanState);
        return await this.verifyOtherCategories(scanState);
    }
    async verifyOtherCategories(scanState) {
        const pool = new HasherPool_1.HasherPool();
        const poolLoadTracker = new WorkerPoolLoadTracker_1.WorkerPoolLoadTracker(pool, CategoryScanner_1.POOL_MAX_PENDING_TASKS);
        const categoryVerificationData = {
            calculatedTxSetHashes: new Map(),
            expectedHashesPerLedger: new Map(),
            calculatedTxSetResultHashes: new Map(),
            calculatedLedgerHeaderHashes: new Map(),
            protocolVersions: new Map()
        };
        const processRequestResult = async (readStream, request) => {
            if (!(readStream instanceof stream.Readable)) {
                return (0, neverthrow_1.err)(new http_helper_1.FileNotFoundError(request));
            }
            //debugging, can be removed if no more pipeline issues
            const streamErrorListener = (error) => console.log('readstream error', (0, shared_1.mapUnknownToError)(error).message, request.url.value);
            readStream.on('error', streamErrorListener);
            const xdrStreamReader = new XdrStreamReader_1.XdrStreamReader();
            const gunzip = (0, zlib_1.createGunzip)();
            const categoryXDRProcessor = new CategoryXDRProcessor_1.CategoryXDRProcessor(pool, request.url, request.meta.category, categoryVerificationData);
            try {
                await (0, promises_1.pipeline)([
                    readStream,
                    gunzip,
                    xdrStreamReader,
                    categoryXDRProcessor
                ]);
                while (pool.workerpool.stats().pendingTasks >
                    CategoryScanner_1.POOL_MAX_PENDING_TASKS) {
                    await (0, http_helper_1.asyncSleep)(10);
                }
                return (0, neverthrow_1.ok)(undefined);
            }
            catch (error) {
                if ((0, isZLibError_1.isZLibError)(error)) {
                    return (0, neverthrow_1.err)(new http_helper_1.RetryableQueueError(request, new ScanError_1.ScanError(ScanError_1.ScanErrorType.TYPE_VERIFICATION, request.url.value, error.message)));
                }
                else {
                    return (0, neverthrow_1.err)(new http_helper_1.RetryableQueueError(request, (0, shared_1.mapUnknownToError)(error)));
                }
            }
            finally {
                readStream.off('error', streamErrorListener);
            }
        };
        const verifyResult = await this.httpQueue.sendRequests(RequestGenerator_1.RequestGenerator.generateCategoryRequests(scanState.checkPoints, scanState.baseUrl, http_helper_1.RequestMethod.GET), {
            stallTimeMs: 150,
            concurrency: scanState.concurrency,
            nrOfRetries: 6, //last retry is after 1 min wait. 2 minute total wait time
            rampUpConnections: true,
            httpOptions: {
                httpAgent: scanState.httpAgent,
                httpsAgent: scanState.httpsAgent,
                responseType: 'stream',
                socketTimeoutMs: 60000,
                connectionTimeoutMs: 10000
            }
        }, processRequestResult);
        await CategoryScanner_1.terminatePool(poolLoadTracker, pool);
        if (verifyResult.isErr()) {
            return (0, neverthrow_1.err)((0, mapHttpQueueErrorToScanError_1.mapHttpQueueErrorToScanError)(verifyResult.error));
        }
        const verificationResult = this.categoryVerificationService.verify(categoryVerificationData, scanState.bucketListHashes, this.checkPointGenerator.checkPointFrequency, scanState.previousLedgerHeader);
        if (verificationResult.isErr())
            return (0, neverthrow_1.err)(this.createVerificationError(scanState.baseUrl, verificationResult.error.ledger, verificationResult.error.category, verificationResult.error.message));
        const maxLedger = (0, getMaximumNumber_1.getMaximumNumber)([
            ...categoryVerificationData.calculatedLedgerHeaderHashes.keys()
        ]);
        if (poolLoadTracker.getPoolFullPercentage() > 50) {
            console.log('Pool full percentage', poolLoadTracker.getPoolFullPercentagePretty());
        }
        return (0, neverthrow_1.ok)({
            ledger: maxLedger,
            hash: categoryVerificationData.calculatedLedgerHeaderHashes.get(maxLedger)
        });
    }
    static async terminatePool(poolLoadTracker, pool) {
        try {
            poolLoadTracker.stop();
            console.log('Waiting until pool is finished', pool.workerpool.stats().activeTasks, pool.workerpool.stats().pendingTasks);
            while (pool.workerpool.stats().pendingTasks > 0 ||
                pool.workerpool.stats().activeTasks > 0) {
                await (0, http_helper_1.asyncSleep)(500);
            }
            await pool.workerpool.terminate(true);
            pool.terminated = true;
        }
        catch (e) {
            //
        }
    }
    async otherCategoriesExist(scanState) {
        const generateCategoryQueueUrls = RequestGenerator_1.RequestGenerator.generateCategoryRequests(scanState.checkPoints, scanState.baseUrl, http_helper_1.RequestMethod.HEAD);
        const categoriesExistResult = await this.httpQueue.sendRequests(generateCategoryQueueUrls, {
            stallTimeMs: 150,
            concurrency: scanState.concurrency,
            nrOfRetries: 5,
            rampUpConnections: true,
            httpOptions: {
                responseType: undefined,
                socketTimeoutMs: 10000,
                httpAgent: scanState.httpAgent,
                httpsAgent: scanState.httpsAgent
            }
        });
        if (categoriesExistResult.isErr()) {
            return (0, neverthrow_1.err)((0, mapHttpQueueErrorToScanError_1.mapHttpQueueErrorToScanError)(categoriesExistResult.error));
        }
        return (0, neverthrow_1.ok)(undefined);
    }
    createVerificationError(baseUrl, ledger, category, message) {
        return new ScanError_1.ScanError(ScanError_1.ScanErrorType.TYPE_VERIFICATION, UrlBuilder_1.UrlBuilder.getCategoryUrl(baseUrl, this.checkPointGenerator.getClosestHigherCheckPoint(ledger), category).value, message);
    }
};
exports.CategoryScanner = CategoryScanner;
exports.CategoryScanner = CategoryScanner = CategoryScanner_1 = __decorate([
    (0, inversify_1.injectable)(),
    __param(1, (0, inversify_1.inject)(di_types_1.TYPES.HttpQueue)),
    __metadata("design:paramtypes", [HASValidator_1.HASValidator,
        http_helper_1.HttpQueue,
        CheckPointGenerator_1.CheckPointGenerator,
        CategoryVerificationService_1.CategoryVerificationService])
], CategoryScanner);
