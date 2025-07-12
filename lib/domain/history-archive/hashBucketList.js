"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashBucketList = void 0;
const crypto_1 = require("crypto");
const neverthrow_1 = require("neverthrow");
const shared_1 = require("shared");
function hashBucketList(historyArchiveState) {
    try {
        const bucketListHash = (0, crypto_1.createHash)('sha256');
        historyArchiveState.currentBuckets.forEach((bucket) => {
            const bucketHash = (0, crypto_1.createHash)('sha256');
            bucketHash.write(Buffer.from(bucket.curr, 'hex'));
            bucketHash.write(Buffer.from(bucket.snap, 'hex'));
            bucketListHash.write(bucketHash.digest());
        });
        return (0, neverthrow_1.ok)({
            ledger: historyArchiveState.currentLedger,
            hash: bucketListHash.digest().toString('base64')
        });
    }
    catch (e) {
        console.log(e);
        return (0, neverthrow_1.err)((0, shared_1.mapUnknownToError)(e));
    }
}
exports.hashBucketList = hashBucketList;
