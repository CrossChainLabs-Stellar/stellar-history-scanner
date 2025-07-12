"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFloodMessage = isFloodMessage;
const stellar_base_1 = require("@stellar/stellar-base");
var MessageType = stellar_base_1.xdr.MessageType;
function isFloodMessage(messageType) {
    return [
        MessageType.scpMessage(),
        MessageType.floodAdvert(),
        MessageType.transaction(),
        MessageType.floodDemand()
    ].includes(messageType);
}
