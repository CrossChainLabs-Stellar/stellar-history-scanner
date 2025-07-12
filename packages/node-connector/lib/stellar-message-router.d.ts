import { Transform, TransformCallback } from 'stream';
import { xdr } from '@stellar/stellar-base';
import StellarMessage = xdr.StellarMessage;
export type MessageTypeName = string;
export declare class StellarMessageRouter extends Transform {
    streams: Map<MessageTypeName, Transform>;
    constructor(streams: Map<MessageTypeName, Transform>);
    _transform(stellarMessage: StellarMessage, encoding: string, next: TransformCallback): void;
}
//# sourceMappingURL=stellar-message-router.d.ts.map