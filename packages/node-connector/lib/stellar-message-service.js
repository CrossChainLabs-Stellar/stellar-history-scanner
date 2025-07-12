"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyStatementXDRSignature = verifyStatementXDRSignature;
exports.createStatementXDRSignature = createStatementXDRSignature;
exports.getPublicKeyStringFromBuffer = getPublicKeyStringFromBuffer;
exports.createSCPEnvelopeSignature = createSCPEnvelopeSignature;
exports.verifySCPEnvelopeSignature = verifySCPEnvelopeSignature;
exports.getQuorumSetFromMessage = getQuorumSetFromMessage;
exports.getIpFromPeerAddress = getIpFromPeerAddress;
const stellar_base_1 = require("@stellar/stellar-base");
const neverthrow_1 = require("neverthrow");
const crypto_helper_1 = require("./crypto-helper");
function verifyStatementXDRSignature(statementXDR, peerId, signature, network) {
    try {
        const body = Buffer.concat([
            network,
            Buffer.from([0, 0, 0, 1]),
            statementXDR
        ]);
        return (0, neverthrow_1.ok)((0, crypto_helper_1.verifySignature)(peerId, signature, body));
    }
    catch (error) {
        if (error instanceof Error)
            return (0, neverthrow_1.err)(error);
        else
            return (0, neverthrow_1.err)(new Error('Error verifying statement xdr signature'));
    }
}
function createStatementXDRSignature(scpStatementXDR, publicKey, secretKey, network) {
    try {
        const body = Buffer.concat([
            network,
            Buffer.from([0, 0, 0, 1]),
            scpStatementXDR
        ]);
        const secret = Buffer.concat([secretKey, publicKey]);
        return (0, neverthrow_1.ok)((0, crypto_helper_1.createSignature)(secret, body));
    }
    catch (error) {
        if (error instanceof Error)
            return (0, neverthrow_1.err)(error);
        else
            return (0, neverthrow_1.err)(new Error('Error creating statement xdr signature'));
    }
}
function getPublicKeyStringFromBuffer(buffer) {
    try {
        return (0, neverthrow_1.ok)(stellar_base_1.StrKey.encodeEd25519PublicKey(buffer).toString());
    }
    catch (error) {
        if (error instanceof Error)
            return (0, neverthrow_1.err)(error);
        else
            return (0, neverthrow_1.err)(new Error('error parsing public key string from buffer'));
    }
}
function createSCPEnvelopeSignature(scpStatement, publicKey, secretKey, network) {
    try {
        return createStatementXDRSignature(scpStatement.toXDR(), publicKey, secretKey, network);
    }
    catch (error) {
        if (error instanceof Error)
            return (0, neverthrow_1.err)(error);
        else
            return (0, neverthrow_1.err)(new Error('Error creating scp envelope signature'));
    }
}
function verifySCPEnvelopeSignature(scpEnvelope, network) {
    try {
        return verifyStatementXDRSignature(scpEnvelope.statement().toXDR(), scpEnvelope.statement().nodeId().value(), scpEnvelope.signature(), network);
    }
    catch (error) {
        if (error instanceof Error)
            return (0, neverthrow_1.err)(error);
        else
            return (0, neverthrow_1.err)(new Error('Error verifying scp envelope signature'));
    }
}
function getQuorumSetFromMessage(scpQuorumSetMessage) {
    try {
        return (0, neverthrow_1.ok)(getQuorumSetFromMessageRecursive(scpQuorumSetMessage));
    }
    catch (error) {
        if (error instanceof Error)
            return (0, neverthrow_1.err)(error);
        else
            return (0, neverthrow_1.err)(new Error('Error getting quorumSet from message'));
    }
}
function getQuorumSetFromMessageRecursive(scpQuorumSetMessage) {
    return {
        threshold: scpQuorumSetMessage.threshold(),
        validators: scpQuorumSetMessage
            .validators()
            .map((validator) => stellar_base_1.StrKey.encodeEd25519PublicKey(validator.value())),
        innerQuorumSets: scpQuorumSetMessage
            .innerSets()
            .map((innerSet) => getQuorumSetFromMessageRecursive(innerSet))
    };
}
function getIpFromPeerAddress(peerAddress) {
    try {
        const peerAddressIp = peerAddress.ip().value();
        return (0, neverthrow_1.ok)(peerAddressIp[0] +
            '.' +
            peerAddressIp[1] +
            '.' +
            peerAddressIp[2] +
            '.' +
            peerAddressIp[3]);
    }
    catch (error) {
        if (error instanceof Error)
            return (0, neverthrow_1.err)(error);
        else
            return (0, neverthrow_1.err)(new Error('Error getting ip from peer address'));
    }
}
