import { Result } from 'neverthrow';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpError, HttpOptions, HttpResponse, HttpService } from './HttpService';
import { Url } from './Url';
export declare class AxiosHttpService implements HttpService {
    protected userAgent: string;
    constructor(userAgent: string);
    delete(url: Url, httpOptions?: HttpOptions): Promise<Result<HttpResponse, HttpError>>;
    post(url: Url, data: Record<string, unknown>, httpOptions?: HttpOptions): Promise<Result<HttpResponse, HttpError>>;
    head(url: Url, httpOptions?: HttpOptions): Promise<Result<HttpResponse, HttpError>>;
    get(url: Url, httpOptions?: HttpOptions): Promise<Result<HttpResponse, HttpError>>;
    protected mapHttpOptionsToAxiosRequestConfig(httpOptions?: HttpOptions): AxiosRequestConfig;
    private performRequest;
    protected mapAxiosResponseToHttpResponse(axiosResponse: AxiosResponse): HttpResponse;
    protected mapErrorToHttpError(error: unknown, url: Url): HttpError;
}
//# sourceMappingURL=AxiosHttpService.d.ts.map