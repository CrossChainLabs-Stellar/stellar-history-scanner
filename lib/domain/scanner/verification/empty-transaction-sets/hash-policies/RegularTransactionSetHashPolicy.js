"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegularTransactionSetHashPolicy = void 0;
const crypto_1 = require("crypto");
class RegularTransactionSetHashPolicy {
    calculateHash(previousLedgerHeaderHash) {
        const previousLedgerHashHashed = (0, crypto_1.createHash)('sha256');
        previousLedgerHashHashed.update(Buffer.from(previousLedgerHeaderHash, 'base64'));
        return previousLedgerHashHashed.digest('base64');
    }
}
exports.RegularTransactionSetHashPolicy = RegularTransactionSetHashPolicy;
