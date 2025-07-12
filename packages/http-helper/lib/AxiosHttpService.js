"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosHttpService = void 0;
const neverthrow_1 = require("neverthrow");
const axios_1 = __importDefault(require("axios"));
const shared_1 = require("shared");
const HttpService_1 = require("./HttpService");
class AxiosHttpService {
    userAgent;
    constructor(userAgent) {
        this.userAgent = userAgent;
        this.userAgent = userAgent;
    }
    async delete(url, httpOptions) {
        return await this.performRequest(url, axios_1.default.delete, httpOptions);
    }
    async post(url, data, httpOptions) {
        return await this.performRequest(url, axios_1.default.post, httpOptions, data);
    }
    async head(url, httpOptions) {
        return await this.performRequest(url, axios_1.default.head, httpOptions);
    }
    async get(url, httpOptions) {
        return await this.performRequest(url, axios_1.default.get, httpOptions);
    }
    mapHttpOptionsToAxiosRequestConfig(httpOptions) {
        if (!httpOptions)
            return {};
        const timeoutMs = httpOptions.socketTimeoutMs
            ? httpOptions.socketTimeoutMs
            : 2000;
        const headers = { 'User-Agent': this.userAgent }; //could be expanded
        const auth = httpOptions.auth;
        const responseType = httpOptions.responseType
            ? httpOptions.responseType
            : 'json';
        const maxContentLength = httpOptions.maxContentLength;
        return {
            timeout: timeoutMs,
            headers: headers,
            auth: auth,
            responseType: responseType,
            maxContentLength: maxContentLength,
            httpsAgent: httpOptions.httpsAgent,
            httpAgent: httpOptions.httpAgent,
            signal: httpOptions.abortSignal
        };
    }
    async performRequest(url, operation, httpOptions, data) {
        let connectionTimeout;
        let connectionTimeoutMs;
        const socketTimeoutMs = httpOptions && httpOptions.socketTimeoutMs
            ? httpOptions.socketTimeoutMs
            : 2000;
        if (httpOptions && httpOptions.connectionTimeoutMs) {
            connectionTimeoutMs = httpOptions.connectionTimeoutMs;
        }
        else {
            connectionTimeoutMs = socketTimeoutMs; //BC, should be removed in the future;
        }
        try {
            const source = axios_1.default.CancelToken.source();
            if (connectionTimeoutMs > 0) {
                connectionTimeout = setTimeout(() => {
                    source.cancel('SB Connection time-out');
                    // Timeout Logic
                }, connectionTimeoutMs);
            }
            const requestConfig = this.mapHttpOptionsToAxiosRequestConfig(httpOptions);
            requestConfig.cancelToken = source.token;
            let axiosResponse;
            if (data)
                axiosResponse = await operation(url.value, data, requestConfig);
            else
                axiosResponse = await operation(url.value, requestConfig);
            if (connectionTimeout)
                clearTimeout(connectionTimeout);
            return (0, neverthrow_1.ok)(this.mapAxiosResponseToHttpResponse(axiosResponse));
        }
        catch (error) {
            if (connectionTimeout)
                clearTimeout(connectionTimeout);
            return (0, neverthrow_1.err)(this.mapErrorToHttpError(error, url));
        }
    }
    mapAxiosResponseToHttpResponse(axiosResponse) {
        return {
            data: axiosResponse.data,
            status: axiosResponse.status,
            statusText: axiosResponse.statusText,
            headers: axiosResponse.headers
        };
    }
    mapErrorToHttpError(error, url) {
        if (axios_1.default.isAxiosError(error)) {
            return new HttpService_1.HttpError(error.message, error.code, error.response);
        }
        if (error instanceof Error)
            return new HttpService_1.HttpError(error.message);
        if ((0, shared_1.isObject)(error) && (0, shared_1.isString)(error.message))
            return new HttpService_1.HttpError(error.message, 'SB_CONN_TIMEOUT'); //this is our Cancel timeout
        return new HttpService_1.HttpError('Error getting url: ' + url.value, 'UNKNOWN');
    }
}
exports.AxiosHttpService = AxiosHttpService;
