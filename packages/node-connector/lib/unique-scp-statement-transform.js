"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueSCPStatementTransform = void 0;
const stream_1 = require("stream");
const lru_cache_1 = require("lru-cache");
const stellar_base_1 = require("@stellar/stellar-base");
var MessageType = stellar_base_1.xdr.MessageType;
const stellar_message_service_1 = require("./stellar-message-service");
class UniqueSCPStatementTransform extends stream_1.Transform {
    cache = new lru_cache_1.LRUCache({ max: 5000 });
    constructor() {
        super({
            objectMode: true,
            readableObjectMode: true,
            writableObjectMode: true
        });
    }
    _transform(stellarMessage, encoding, next) {
        if (stellarMessage.switch() !== MessageType.scpMessage())
            return next();
        if (this.cache.has(stellarMessage.envelope().signature().toString())) {
            console.log('cache hit');
            return next();
        }
        this.cache.set(stellarMessage.envelope().signature().toString(), 1);
        //todo: if we use worker pool and 'async' next call, will the internal buffer fill up too fast and block reading?
        if ((0, stellar_message_service_1.verifySCPEnvelopeSignature)(stellarMessage.envelope(), (0, stellar_base_1.hash)(Buffer.from(stellar_base_1.Networks.PUBLIC))))
            return next(null, stellarMessage.envelope().statement().toXDR('base64'));
        return next();
    }
}
exports.UniqueSCPStatementTransform = UniqueSCPStatementTransform;
