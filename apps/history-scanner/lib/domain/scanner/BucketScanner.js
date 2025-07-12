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
exports.BucketScanner = void 0;
const neverthrow_1 = require("neverthrow");
const RequestGenerator_1 = require("./RequestGenerator");
const http_helper_1 = require("http-helper");
const inversify_1 = require("inversify");
const mapHttpQueueErrorToScanError_1 = require("./mapHttpQueueErrorToScanError");
const zlib_1 = require("zlib");
const crypto_1 = require("crypto");
const stream = __importStar(require("stream"));
const promises_1 = require("stream/promises");
const shared_1 = require("shared");
const ScanError_1 = require("../scan/ScanError");
const isZLibError_1 = require("./isZLibError");
const di_types_1 = require("../../infrastructure/di/di-types");
let BucketScanner = class BucketScanner {
    httpQueue;
    constructor(httpQueue) {
        this.httpQueue = httpQueue;
    }
    async scan(scanState, verify = false) {
        if (verify) {
            return await this.verify(scanState);
        }
        else {
            return await this.exists(scanState);
        }
    }
    async verify(scanState) {
        const verify = async (readStream, request) => {
            if (!(readStream instanceof stream.Readable))
                return (0, neverthrow_1.err)(new http_helper_1.FileNotFoundError(request));
            const zlib = (0, zlib_1.createGunzip)();
            const hasher = (0, crypto_1.createHash)('sha256');
            try {
                await (0, promises_1.pipeline)(readStream, zlib, hasher);
                if (hasher.digest('hex') !== request.meta?.hash)
                    return (0, neverthrow_1.err)(new http_helper_1.QueueError(request, new ScanError_1.ScanError(ScanError_1.ScanErrorType.TYPE_VERIFICATION, request.url.value, 'Wrong bucket hash')));
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
        };
        const verifyBucketsResult = await this.httpQueue.sendRequests(RequestGenerator_1.RequestGenerator.generateBucketRequests(scanState.bucketHashesToScan, scanState.baseUrl, http_helper_1.RequestMethod.GET), {
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
        }, verify);
        if (verifyBucketsResult.isErr()) {
            return (0, neverthrow_1.err)((0, mapHttpQueueErrorToScanError_1.mapHttpQueueErrorToScanError)(verifyBucketsResult.error));
        }
        return (0, neverthrow_1.ok)(undefined);
    }
    async exists(scanState) {
        const bucketsExistResult = await this.httpQueue.sendRequests(RequestGenerator_1.RequestGenerator.generateBucketRequests(scanState.bucketHashesToScan, scanState.baseUrl, http_helper_1.RequestMethod.HEAD), {
            stallTimeMs: 150,
            concurrency: scanState.concurrency,
            nrOfRetries: 6, //last retry is after 1 min wait. 2 minute total wait time
            rampUpConnections: true,
            httpOptions: {
                responseType: undefined,
                socketTimeoutMs: 5000,
                connectionTimeoutMs: 5000,
                httpAgent: scanState.httpAgent,
                httpsAgent: scanState.httpsAgent
            }
        });
        if (bucketsExistResult.isErr()) {
            return (0, neverthrow_1.err)((0, mapHttpQueueErrorToScanError_1.mapHttpQueueErrorToScanError)(bucketsExistResult.error));
        }
        return (0, neverthrow_1.ok)(undefined);
    }
};
exports.BucketScanner = BucketScanner;
exports.BucketScanner = BucketScanner = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(di_types_1.TYPES.HttpQueue)),
    __metadata("design:paramtypes", [http_helper_1.HttpQueue])
], BucketScanner);
