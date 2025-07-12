"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarMessageRouter = void 0;
const stream_1 = require("stream");
class StellarMessageRouter extends stream_1.Transform {
    streams;
    constructor(streams) {
        super({
            readableObjectMode: true,
            writableObjectMode: true
        });
        this.streams = streams;
    }
    _transform(stellarMessage, encoding, next) {
        const stream = this.streams.get(stellarMessage.switch().name);
        if (stream) {
            stream.write(stellarMessage); //use write, not push because we add to the writable side of the duplex stream. Push is for adding to the readable side.
        }
        return next();
    }
}
exports.StellarMessageRouter = StellarMessageRouter;
