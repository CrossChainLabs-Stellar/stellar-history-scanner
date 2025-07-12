import { HttpError, HttpResponse } from './HttpService';
import { Result } from 'neverthrow';
export declare function retryHttpRequestIfNeeded<Args extends unknown[]>(amount: number, sleepMs: number, httpAction: (...httpActionParameters: Args) => Promise<Result<HttpResponse, HttpError>>, ...parameters: Args): Promise<Result<HttpResponse, HttpError>>;
//# sourceMappingURL=HttpRequestRetry.d.ts.map