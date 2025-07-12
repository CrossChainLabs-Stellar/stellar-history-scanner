"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpQueue = exports.RequestMethod = exports.RetryableQueueError = exports.FileNotFoundError = exports.QueueError = void 0;
const Url_1 = require("./Url");
const async_1 = require("async");
const neverthrow_1 = require("neverthrow");
const custom_error_1 = require("custom-error");
const asyncSleep_1 = require("./asyncSleep");
const events_1 = require("events");
const shared_1 = require("shared");
class QueueError extends custom_error_1.CustomError {
    request;
    constructor(request, cause, message = 'Error executing request' + request.url, name = QueueError.name) {
        super(message, name, cause);
        this.request = request;
    }
}
exports.QueueError = QueueError;
class FileNotFoundError extends QueueError {
    request;
    constructor(request) {
        super(request, undefined, 'File not found: ' + request.url, FileNotFoundError.name);
        this.request = request;
    }
}
exports.FileNotFoundError = FileNotFoundError;
class RetryableQueueError extends QueueError {
    request;
    constructor(request, cause, message = 'Error executing request' + request.url) {
        super(request, (0, shared_1.instanceOfError)(cause) ? cause : undefined, message, RetryableQueueError.name);
        this.request = request;
    }
}
exports.RetryableQueueError = RetryableQueueError;
var RequestMethod;
(function (RequestMethod) {
    RequestMethod[RequestMethod["GET"] = 0] = "GET";
    RequestMethod[RequestMethod["HEAD"] = 1] = "HEAD";
})(RequestMethod || (exports.RequestMethod = RequestMethod = {}));
class HttpQueue {
    httpService;
    logger;
    constructor(httpService, logger) {
        this.httpService = httpService;
        this.logger = logger;
    }
    async sendRequests(requests, httpQueueOptions, responseHandler) {
        let counter = 0;
        let activeRequestCount = 0;
        const getWorker = async (request) => {
            counter++;
            activeRequestCount++;
            if (counter <= httpQueueOptions.concurrency &&
                httpQueueOptions.rampUpConnections) {
                //avoid opening up all the tcp connections at the same time
                await (0, asyncSleep_1.asyncSleep)((counter - 1) * 20);
                //was the queue terminated while sleeping?
                if (httpQueueOptions.httpOptions.abortSignal &&
                    httpQueueOptions.httpOptions.abortSignal.aborted) {
                    activeRequestCount--;
                    return;
                }
            }
            const result = await this.processSingleRequestWithRetryAndDelay(request, httpQueueOptions, responseHandler);
            activeRequestCount--;
            if (result.isErr())
                throw result.error;
        };
        const abortController = new AbortController();
        (0, events_1.setMaxListeners)(httpQueueOptions.concurrency, abortController.signal);
        httpQueueOptions.httpOptions.abortSignal = abortController.signal;
        try {
            await (0, async_1.eachLimit)(requests, httpQueueOptions.concurrency, getWorker);
            return (0, neverthrow_1.ok)(undefined);
        }
        catch (error) {
            abortController.abort();
            while (activeRequestCount > 0) {
                console.log('Waiting for cleanup of active requests', activeRequestCount);
                await (0, asyncSleep_1.asyncSleep)(1000);
            }
            if (!(error instanceof QueueError)) {
                throw new Error('Unexpected error in http queue');
            }
            return (0, neverthrow_1.err)(error);
        }
    }
    async processSingleRequestWithRetryAndDelay(request, httpQueueOptions, responseHandler) {
        let requestCount = 0;
        let result;
        let retry = false;
        do {
            requestCount++;
            result = await this.processSingleRequestWithDelay(request, httpQueueOptions, responseHandler);
            retry =
                result.isErr() &&
                    result.error instanceof RetryableQueueError &&
                    requestCount <= httpQueueOptions.nrOfRetries &&
                    !httpQueueOptions.httpOptions.abortSignal?.aborted;
            if (retry && result.isErr()) {
                if (requestCount > 2) {
                    console.log('retry', requestCount, request.url.value, result.error.message);
                }
                await (0, asyncSleep_1.asyncSleep)(Math.pow(2, requestCount) * 1000);
            }
        } while (retry);
        return result;
    }
    //to avoid rate limiting;
    async processSingleRequestWithDelay(request, httpQueueOptions, responseHandler) {
        const time = new Date().getTime();
        const result = await this.processSingleRequest(request, httpQueueOptions, responseHandler);
        const elapsed = new Date().getTime() - time;
        if (elapsed < httpQueueOptions.stallTimeMs) {
            await (0, asyncSleep_1.asyncSleep)(httpQueueOptions.stallTimeMs - elapsed);
        }
        return result;
    }
    async processSingleRequest(request, httpQueueOptions, responseHandler) {
        let url = request.url;
        if (httpQueueOptions.cacheBusting) {
            const cacheAvoidingUrl = Url_1.Url.create(url.value + '?bust=' + Math.random());
            if (cacheAvoidingUrl.isErr())
                throw cacheAvoidingUrl.error;
            url = cacheAvoidingUrl.value;
        }
        const response = await this.mapRequestMethodToOperation(request.method)(url, httpQueueOptions.httpOptions);
        return await HttpQueue.handleResponse(request, response, responseHandler);
    }
    static async handleResponse(request, response, responseHandler) {
        if (response.isOk()) {
            if (responseHandler) {
                return await responseHandler(response.value.data, request);
            }
            else
                return (0, neverthrow_1.ok)(undefined);
        }
        else {
            return (0, neverthrow_1.err)(HttpQueue.parseError(response.error, request));
        }
    }
    mapRequestMethodToOperation(method) {
        if (method === RequestMethod.HEAD)
            return this.httpService.head.bind(this.httpService);
        if (method === RequestMethod.GET)
            return this.httpService.get.bind(this.httpService);
        throw new Error('Unknown request method');
    }
    static parseError(error, request) {
        if (error.code &&
            [
                'ETIMEDOUT',
                'ECONNABORTED',
                'TIMEOUT',
                'ERR_REQUEST_ABORTED',
                'SB_CONN_TIMEOUT'
            ].includes(error.code)) {
            return new RetryableQueueError(request, error);
        }
        if (error.response?.status === 429) {
            return new RetryableQueueError(request, error);
        }
        if (error.response?.status === 404) {
            return new FileNotFoundError(request);
        }
        return new RetryableQueueError(request, error);
    }
}
exports.HttpQueue = HttpQueue;
