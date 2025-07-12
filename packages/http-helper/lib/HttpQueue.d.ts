import { Url } from './Url';
import { Logger } from 'logger';
import { Result } from 'neverthrow';
import { CustomError } from 'custom-error';
import { HttpError, HttpOptions, HttpService } from './HttpService';
export interface HttpQueueOptions {
    rampUpConnections: boolean;
    concurrency: number;
    nrOfRetries: number;
    stallTimeMs: number;
    httpOptions: HttpOptions;
    cacheBusting?: boolean;
}
export declare class QueueError extends CustomError {
    request: Request;
    constructor(request: Request, cause?: HttpError | Error, message?: string, name?: string);
}
export declare class FileNotFoundError extends QueueError {
    request: Request;
    constructor(request: Request);
}
export declare class RetryableQueueError extends QueueError {
    request: Request;
    constructor(request: Request, cause?: HttpError | Error | unknown, message?: string);
}
export declare enum RequestMethod {
    GET = 0,
    HEAD = 1
}
export interface Request<Meta extends Record<string, unknown> = Record<string, unknown>> {
    meta: Meta;
    url: Url;
    method: RequestMethod;
}
export declare class HttpQueue {
    protected httpService: HttpService;
    private logger;
    constructor(httpService: HttpService, logger: Logger);
    sendRequests<Meta extends Record<string, unknown> = Record<string, unknown>>(requests: IterableIterator<Request<Meta>>, httpQueueOptions: HttpQueueOptions, responseHandler?: (result: unknown, request: Request<Meta>) => Promise<Result<void, QueueError>>): Promise<Result<void, QueueError>>;
    private processSingleRequestWithRetryAndDelay;
    private processSingleRequestWithDelay;
    private processSingleRequest;
    private static handleResponse;
    private mapRequestMethodToOperation;
    private static parseError;
}
//# sourceMappingURL=HttpQueue.d.ts.map