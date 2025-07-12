import { Transform, TransformCallback } from 'stream';
import { LRUCache } from 'lru-cache';
import { xdr } from '@stellar/stellar-base';
import StellarMessage = xdr.StellarMessage;
export declare class UniqueSCPStatementTransform extends Transform {
    protected cache: LRUCache<string, number, unknown>;
    constructor();
    _transform(stellarMessage: StellarMessage, encoding: string, next: TransformCallback): void;
}
//# sourceMappingURL=unique-scp-statement-transform.d.ts.map