import { Url } from './Url';
import { Result } from 'neverthrow';
import * as http from 'http';
import * as https from 'https';
import { CustomError } from 'custom-error';
export declare function isHttpError(payload: unknown): payload is HttpError;
export interface HttpResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: unknown;
}
export declare class HttpError<T = unknown> extends CustomError {
    code?: string;
    response?: HttpResponse<T>;
    constructor(message?: string, code?: string, response?: HttpResponse<T>);
}
export interface HttpOptions {
    auth?: {
        username: string;
        password: string;
    };
    socketTimeoutMs?: number;
    connectionTimeoutMs?: number;
    maxContentLength?: number;
    responseType?: 'arraybuffer' | 'json' | 'stream';
    httpAgent?: http.Agent;
    httpsAgent?: https.Agent;
    abortSignal?: AbortSignal;
}
export interface HttpService {
    post(url: Url, data: Record<string, unknown>, httpOptions?: HttpOptions): Promise<Result<HttpResponse, HttpError>>;
    delete(url: Url, httpOptions?: HttpOptions): Promise<Result<HttpResponse, HttpError>>;
    get(url: Url, httpOptions?: HttpOptions): Promise<Result<HttpResponse, HttpError>>;
    head(url: Url, httpOptions?: HttpOptions): Promise<Result<HttpResponse, HttpError>>;
}
//# sourceMappingURL=HttpService.d.ts.map