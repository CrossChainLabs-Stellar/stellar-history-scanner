"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workerpool_1 = require("workerpool");
const stellar_message_service_1 = require("../stellar-message-service");
function verifyStatementXDRSignatureWorker(statementXDR, peerId, signature, network) {
    return handleResult((0, stellar_message_service_1.verifyStatementXDRSignature)(statementXDR, peerId, signature, network));
}
function handleResult(result) {
    if (result.isErr())
        throw result.error;
    else
        return result.value;
}
(0, workerpool_1.worker)({
    verifyStatementXDRSignature: verifyStatementXDRSignatureWorker
});
