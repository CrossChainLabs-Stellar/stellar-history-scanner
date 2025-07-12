import { Transform, TransformCallback } from 'stream';
export declare class XdrStreamReader extends Transform {
    private remainingBuffer;
    constructor();
    _transform(xdrChunk: any, encoding: string, next: TransformCallback): void;
    getMessageLengthFromXDRBuffer(buffer: Buffer): number;
    getXDRBuffer(buffer: Buffer, messageLength: number): [Buffer, Buffer];
}
//# sourceMappingURL=XdrStreamReader.d.ts.map