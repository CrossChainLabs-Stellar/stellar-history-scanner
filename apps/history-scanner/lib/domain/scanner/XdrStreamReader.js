"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XdrStreamReader = void 0;
const stream_1 = require("stream");
class XdrStreamReader extends stream_1.Transform {
    remainingBuffer = Buffer.from([]);
    constructor() {
        super();
    }
    _transform(xdrChunk, encoding, next) {
        if (!Buffer.isBuffer(xdrChunk)) {
            if (xdrChunk instanceof Uint8Array) {
                xdrChunk = Buffer.from(xdrChunk);
            }
            else
                return next(new Error('xdrChunk is not a buffer or uint8array'));
        }
        let buffer = Buffer.concat([this.remainingBuffer, xdrChunk]);
        let nextMessageLength = this.getMessageLengthFromXDRBuffer(buffer);
        while (nextMessageLength !== 0 && buffer.length - 4 >= nextMessageLength) {
            let xdrBuffer;
            [xdrBuffer, buffer] = this.getXDRBuffer(buffer, nextMessageLength);
            this.push(xdrBuffer);
            nextMessageLength = this.getMessageLengthFromXDRBuffer(buffer);
        }
        this.remainingBuffer = buffer;
        return next();
    }
    getMessageLengthFromXDRBuffer(buffer) {
        if (buffer.length < 4)
            return 0;
        const length = buffer.slice(0, 4);
        length[0] &= 0x7f; //clear xdr continuation bit
        return length.readUInt32BE(0);
    }
    getXDRBuffer(buffer, messageLength) {
        return [
            buffer.slice(4, messageLength + 4),
            buffer.slice(4 + messageLength)
        ];
    }
}
exports.XdrStreamReader = XdrStreamReader;
