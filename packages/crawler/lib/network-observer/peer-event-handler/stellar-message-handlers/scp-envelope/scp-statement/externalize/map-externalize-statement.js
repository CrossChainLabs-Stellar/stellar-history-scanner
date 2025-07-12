"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapExternalizeStatement = mapExternalizeStatement;
const neverthrow_1 = require("neverthrow");
const node_connector_1 = require("node-connector");
const extract_close_time_from_value_1 = require("./extract-close-time-from-value");
function mapExternalizeStatement(externalizeStatement) {
    const publicKeyResult = (0, node_connector_1.getPublicKeyStringFromBuffer)(externalizeStatement.nodeId().value());
    if (publicKeyResult.isErr()) {
        return (0, neverthrow_1.err)(publicKeyResult.error);
    }
    const publicKey = publicKeyResult.value;
    const slotIndex = BigInt(externalizeStatement.slotIndex().toString());
    const value = externalizeStatement.pledges().externalize().commit().value();
    const closeTime = (0, extract_close_time_from_value_1.extractCloseTimeFromValue)(value);
    return (0, neverthrow_1.ok)({
        publicKey,
        slotIndex,
        value: value.toString('base64'),
        closeTime
    });
}
