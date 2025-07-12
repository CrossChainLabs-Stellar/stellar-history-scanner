"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralizedTransactionSetHashPolicy = void 0;
require("reflect-metadata");
const crypto_1 = require("crypto");
const stellar_base_1 = require("@stellar/stellar-base");
class GeneralizedTransactionSetHashPolicy {
    calculateHash(previousLedgerHeaderHash) {
        // @ts-ignore
        const emptyPhase = new stellar_base_1.xdr.TransactionPhase(0, []);
        const transactionSetV1 = new stellar_base_1.xdr.TransactionSetV1({
            previousLedgerHash: Buffer.from(previousLedgerHeaderHash, 'base64'),
            phases: [emptyPhase, emptyPhase] //protocol 20 has two phases
        });
        const generalized = new stellar_base_1.xdr.GeneralizedTransactionSet(
        //@ts-ignore
        1, transactionSetV1);
        const hash = (0, crypto_1.createHash)('sha256');
        hash.update(generalized.toXDR());
        return hash.digest('base64');
    }
}
exports.GeneralizedTransactionSetHashPolicy = GeneralizedTransactionSetHashPolicy;
