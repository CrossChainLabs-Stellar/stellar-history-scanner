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
var ArchivePerformanceTester_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchivePerformanceTester = void 0;
const RequestGenerator_1 = require("./RequestGenerator");
const http_helper_1 = require("http-helper");
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const CheckPointGenerator_1 = require("../check-point/CheckPointGenerator");
const inversify_1 = require("inversify");
const Category_1 = require("../history-archive/Category");
const sortDescending_1 = require("./sortDescending");
const neverthrow_1 = require("neverthrow");
let ArchivePerformanceTester = ArchivePerformanceTester_1 = class ArchivePerformanceTester {
    checkPointGenerator;
    httpQueue;
    maxTimeMSPerFile;
    constructor(checkPointGenerator, httpQueue, maxTimeMSPerFile = 30 //how much time can we spend on downloading a small file on average with concurrency.
    ) {
        this.checkPointGenerator = checkPointGenerator;
        this.httpQueue = httpQueue;
        this.maxTimeMSPerFile = maxTimeMSPerFile;
    }
    async test(baseUrl, highestLedger, largeFiles = false, concurrencyRange = [50, 35, 25, 20, 15, 10], nrOfCheckPoints = 5000) {
        const concurrencyRangeSorted = (0, sortDescending_1.sortDescending)(concurrencyRange);
        let concurrencyRangeIndex = 0;
        const concurrencyTimings = [];
        let consecutiveIncreasingCount = 0; //we will stop after three consecutive increasing timings.
        let previousDuration = Infinity;
        while (concurrencyRangeIndex < concurrencyRangeSorted.length &&
            consecutiveIncreasingCount < 2) {
            const { httpAgent, httpsAgent } = ArchivePerformanceTester_1.createHttpAgents(concurrencyRangeSorted[concurrencyRangeIndex]);
            //first open the sockets to have consistent test results (opening sockets can take longer than request on opened socket)
            const warmupSettings = {
                highestLedger: highestLedger,
                warmup: true,
                nrOfCheckPoints: concurrencyRangeSorted[concurrencyRangeIndex],
                concurrency: concurrencyRangeSorted[concurrencyRangeIndex],
                largeFiles: largeFiles
            };
            await this.testDownload(baseUrl, 
            //we need to warmup concurrency amount of connections because there is one HAS-file per checkpoint
            httpAgent, httpsAgent, warmupSettings);
            const settings = {
                highestLedger: highestLedger,
                warmup: true,
                nrOfCheckPoints: nrOfCheckPoints,
                concurrency: concurrencyRangeSorted[concurrencyRangeIndex],
                largeFiles: largeFiles
            };
            const duration = await this.measureFilesTest(baseUrl, httpAgent, httpsAgent, settings);
            concurrencyTimings.push(duration);
            if (previousDuration < duration)
                consecutiveIncreasingCount++;
            else
                consecutiveIncreasingCount = 0;
            previousDuration = duration;
            concurrencyRangeIndex++;
            httpAgent.destroy();
            httpsAgent.destroy();
            await (0, http_helper_1.asyncSleep)(3000);
        }
        const fastestTime = Math.min(...concurrencyTimings);
        if (fastestTime === Infinity)
            return (0, neverthrow_1.err)(new Error('Could not determine optimal concurrency'));
        const optimalConcurrencyIndex = concurrencyTimings.indexOf(fastestTime);
        const optimalConcurrency = concurrencyRangeSorted[optimalConcurrencyIndex];
        const timeMsPerFile = concurrencyTimings[optimalConcurrencyIndex] / nrOfCheckPoints;
        return (0, neverthrow_1.ok)({
            optimalConcurrency,
            timeMsPerFile,
            isSlowArchive: timeMsPerFile > this.maxTimeMSPerFile
        });
    }
    async measureFilesTest(baseUrl, httpAgent, httpsAgent, settings) {
        const start = new Date().getTime();
        const result = await this.testDownload(baseUrl, httpAgent, httpsAgent, settings);
        if (result.isErr()) {
            return Infinity;
        }
        else {
            const stop = new Date().getTime();
            return Math.round(10 * (stop - start)) / 10;
        }
    }
    static createHttpAgents(concurrency) {
        const httpAgent = new http.Agent({
            keepAlive: true,
            maxSockets: concurrency,
            maxFreeSockets: concurrency,
            scheduling: 'fifo'
        });
        const httpsAgent = new https.Agent({
            keepAlive: true,
            maxSockets: concurrency,
            maxFreeSockets: concurrency,
            scheduling: 'fifo'
        });
        return { httpAgent, httpsAgent };
    }
    static notEnoughCheckPointsInArchive(highestLedger, nrOfCheckPoints) {
        return highestLedger - 64 * nrOfCheckPoints < 0;
    }
    async testDownload(baseUrl, httpAgent, httpsAgent, settings) {
        const fromLedger = ArchivePerformanceTester_1.notEnoughCheckPointsInArchive(settings.highestLedger, settings.nrOfCheckPoints)
            ? 0
            : settings.highestLedger - 64 * settings.nrOfCheckPoints;
        const checkPoints = this.checkPointGenerator.generate(fromLedger, settings.highestLedger);
        let requests;
        if (!settings.largeFiles)
            requests = RequestGenerator_1.RequestGenerator.generateHASRequests(baseUrl, checkPoints, http_helper_1.RequestMethod.GET);
        else
            requests = RequestGenerator_1.RequestGenerator.generateCategoryRequests(checkPoints, baseUrl, http_helper_1.RequestMethod.GET, [Category_1.Category.transactions]);
        const successOrError = await this.httpQueue.sendRequests(requests, {
            stallTimeMs: 150,
            concurrency: settings.concurrency,
            nrOfRetries: 1,
            rampUpConnections: settings.warmup,
            httpOptions: {
                httpAgent: httpAgent,
                httpsAgent: httpsAgent,
                responseType: 'json',
                socketTimeoutMs: settings.largeFiles ? 100000 : 2000,
                connectionTimeoutMs: settings.largeFiles ? 100000 : 2000
            },
            cacheBusting: true
        });
        httpAgent.destroy();
        httpsAgent.destroy();
        return successOrError;
    }
};
exports.ArchivePerformanceTester = ArchivePerformanceTester;
exports.ArchivePerformanceTester = ArchivePerformanceTester = ArchivePerformanceTester_1 = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [CheckPointGenerator_1.CheckPointGenerator,
        http_helper_1.HttpQueue, Object])
], ArchivePerformanceTester);
