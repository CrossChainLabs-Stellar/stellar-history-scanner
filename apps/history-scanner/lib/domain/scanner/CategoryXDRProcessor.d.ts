import { Writable } from 'stream';
import { Category } from '../history-archive/Category';
import { Url } from 'http-helper';
import { CategoryVerificationData } from './CategoryScanner';
import { HasherPool } from './HasherPool';
export declare class CategoryXDRProcessor extends Writable {
    pool: HasherPool;
    url: Url;
    category: Category;
    categoryVerificationData: CategoryVerificationData;
    constructor(pool: HasherPool, url: Url, category: Category, categoryVerificationData: CategoryVerificationData);
    _write(xdr: Buffer, encoding: string, callback: (error?: Error | null) => void): void;
    private performInPool;
}
//# sourceMappingURL=CategoryXDRProcessor.d.ts.map