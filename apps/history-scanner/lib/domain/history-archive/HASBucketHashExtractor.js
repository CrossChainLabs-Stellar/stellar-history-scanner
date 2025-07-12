"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HASBucketHashExtractor = void 0;
class HASBucketHashExtractor {
    static getNonZeroHashes(historyArchiveState) {
        const bucketHashes = [];
        historyArchiveState.currentBuckets.forEach((bucket) => {
            bucketHashes.push(bucket.curr);
            bucketHashes.push(bucket.snap);
            const nextOutput = bucket.next.output;
            if (nextOutput)
                bucketHashes.push(nextOutput);
        });
        return bucketHashes.filter((hash) => !HASBucketHashExtractor.isZeroHash(hash));
    }
    static isZeroHash(hash) {
        return parseInt(hash, 16) === 0;
    }
}
exports.HASBucketHashExtractor = HASBucketHashExtractor;
