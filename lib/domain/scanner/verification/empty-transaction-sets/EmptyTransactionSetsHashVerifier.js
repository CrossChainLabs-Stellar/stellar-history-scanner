"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyTransactionSetsHashVerifier = void 0;
require("reflect-metadata");
const neverthrow_1 = require("neverthrow");
const FirstLedgerHashPolicy_1 = require("./hash-policies/FirstLedgerHashPolicy");
const RegularTransactionSetHashPolicy_1 = require("./hash-policies/RegularTransactionSetHashPolicy");
const GeneralizedTransactionSetHashPolicy_1 = require("./hash-policies/GeneralizedTransactionSetHashPolicy");
const shared_1 = require("shared");
class EmptyTransactionSetsHashVerifier {
    static verify(ledger, protocolVersion, previousLedgerHeaderHash, expectedHash) {
        try {
            let hashCalculationPolicy;
            if (ledger === 1) {
                hashCalculationPolicy = new FirstLedgerHashPolicy_1.FirstLedgerHashPolicy();
            }
            else if (protocolVersion < 20) {
                hashCalculationPolicy = new RegularTransactionSetHashPolicy_1.RegularTransactionSetHashPolicy();
            }
            else {
                hashCalculationPolicy = new GeneralizedTransactionSetHashPolicy_1.GeneralizedTransactionSetHashPolicy();
            }
            const calculatedTxSetHash = hashCalculationPolicy.calculateHash(previousLedgerHeaderHash);
            const match = calculatedTxSetHash === expectedHash;
            if (!match && protocolVersion >= 20 && ledger !== 1) {
                //the first ledger of a new protocol is actually using the previous protocol, this is a known caveat.
                //for the switch to GeneralizedTransactionSetHashPolicy, the first hash check will fail. Thus we fallback to RegularTransactionSetHashPolicy
                //The check is >= 20 even though GeneralizedTransactionSetHashPolicy was introduced in v20, because testnet jumped directly to protocol 21 after
                //a reset, skipping 20.
                const regularTxSetHash = new RegularTransactionSetHashPolicy_1.RegularTransactionSetHashPolicy().calculateHash(previousLedgerHeaderHash);
                return (0, neverthrow_1.ok)(regularTxSetHash === expectedHash);
            }
            return (0, neverthrow_1.ok)(match);
        }
        catch (error) {
            return (0, neverthrow_1.err)(new Error(`Failed to verify hash: ${(0, shared_1.mapUnknownToError)(error).message}`));
        }
    }
}
exports.EmptyTransactionSetsHashVerifier = EmptyTransactionSetsHashVerifier;
