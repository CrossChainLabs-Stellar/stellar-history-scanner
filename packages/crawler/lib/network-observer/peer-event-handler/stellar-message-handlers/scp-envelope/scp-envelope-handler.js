"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScpEnvelopeHandler = void 0;
const stellar_base_1 = require("@stellar/stellar-base");
const node_connector_1 = require("node-connector");
const neverthrow_1 = require("neverthrow");
const ledger_validator_1 = require("./ledger-validator");
/*
 * ScpEnvelopeHandler makes sure that no duplicate SCP envelopes are processed, that the signature is valid and
 * that the ledger sequence is valid. It then delegates the SCP statement to the ScpStatementHandler.
 */
class ScpEnvelopeHandler {
    scpStatementHandler;
    constructor(scpStatementHandler) {
        this.scpStatementHandler = scpStatementHandler;
    }
    handle(scpEnvelope, observation) {
        if (this.isCached(scpEnvelope, observation))
            return (0, neverthrow_1.ok)({
                closedLedger: null
            });
        if (this.isValidLedger(observation, scpEnvelope))
            return (0, neverthrow_1.ok)({
                closedLedger: null
            });
        const verifiedSignature = this.verifySignature(scpEnvelope, observation);
        if (verifiedSignature.isErr())
            return (0, neverthrow_1.err)(verifiedSignature.error);
        return this.scpStatementHandler.handle(scpEnvelope.statement(), observation);
    }
    verifySignature(scpEnvelope, observation) {
        const verifiedResult = (0, node_connector_1.verifySCPEnvelopeSignature)(scpEnvelope, (0, stellar_base_1.hash)(Buffer.from(observation.network)));
        if (verifiedResult.isErr())
            return (0, neverthrow_1.err)(new Error('Error verifying SCP Signature'));
        if (!verifiedResult.value)
            return (0, neverthrow_1.err)(new Error('Invalid SCP Signature'));
        return (0, neverthrow_1.ok)(undefined);
    }
    isValidLedger(observation, scpEnvelope) {
        return !(0, ledger_validator_1.isLedgerSequenceValid)(observation.latestConfirmedClosedLedger, BigInt(scpEnvelope.statement().slotIndex().toString()));
    }
    isCached(scpEnvelope, observation) {
        if (observation.envelopeCache.has(scpEnvelope.signature().toString()))
            return true;
        observation.envelopeCache.set(scpEnvelope.signature().toString(), 1);
        return false;
    }
}
exports.ScpEnvelopeHandler = ScpEnvelopeHandler;
