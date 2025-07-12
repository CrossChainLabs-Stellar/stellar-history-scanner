import { Url, Request, RequestMethod } from 'http-helper';
import { Category } from '../history-archive/Category';
export interface CategoryRequestMeta {
    category: Category;
    [key: string]: unknown;
}
export interface BucketRequestMeta {
    hash: string;
    [key: string]: unknown;
}
export declare class RequestGenerator {
    static generateBucketRequests(bucketHashes: Set<string>, baseUrl: Url, requestMethod: RequestMethod): IterableIterator<Request<BucketRequestMeta>>;
    static generateCategoryRequests(checkPointGenerator: IterableIterator<number>, historyArchiveBaseUrl: Url, requestMethod: RequestMethod, categories?: Category[]): IterableIterator<Request<CategoryRequestMeta>>;
    static generateHASRequests(historyArchiveBaseUrl: Url, checkPointGenerator: IterableIterator<number>, requestMethod: RequestMethod): IterableIterator<Request>;
}
//# sourceMappingURL=RequestGenerator.d.ts.map