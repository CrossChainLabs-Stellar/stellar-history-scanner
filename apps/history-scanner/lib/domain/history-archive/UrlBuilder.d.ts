import { Url } from 'http-helper';
import { CheckPoint } from '../check-point/CheckPointGenerator';
import { Category } from './Category';
export declare class UrlBuilder {
    static getBucketUrl(baseUrl: Url, hash: string): Url;
    static getRootHASUrl(historyBaseUrl: Url): Url;
    static getCategoryUrl(historyBaseUrl: Url, checkPoint: CheckPoint, category: Category): Url;
    static getHASUrl(historyBaseUrl: Url): Url;
    private static getHexPrefix;
    private static getPaddedHex;
    private static getExtension;
}
//# sourceMappingURL=UrlBuilder.d.ts.map