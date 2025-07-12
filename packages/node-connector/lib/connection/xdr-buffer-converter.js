"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stellar_base_1 = require("@stellar/stellar-base");
var AuthenticatedMessage = stellar_base_1.xdr.AuthenticatedMessage;
const neverthrow_1 = require("neverthrow");
exports.default = {
    getMessageLengthFromXDRBuffer: function (buffer) {
        if (buffer.length < 4)
            return 0;
        buffer[0] = buffer[0] &= 0x7f; //clear xdr continuation bit
        return buffer.readUInt32BE(0);
    },
    xdrBufferContainsCompleteMessage: function (buffer, messageLength) {
        return buffer.length - 4 >= messageLength;
    },
    //returns next message and remaining buffer
    getMessageFromXdrBuffer: function (buffer, messageLength) {
        return [
            buffer.slice(4, messageLength + 4),
            buffer.slice(4 + messageLength)
        ];
    },
    getXdrBufferFromMessage: function (message) {
        try {
            const lengthBuffer = Buffer.alloc(4);
            const xdrMessage = message.toXDR();
            lengthBuffer.writeUInt32BE(xdrMessage.length, 0);
            return (0, neverthrow_1.ok)(Buffer.concat([lengthBuffer, xdrMessage]));
        }
        catch (error) {
            let msg;
            if (message instanceof AuthenticatedMessage)
                msg = message.value().message();
            else
                msg = message;
            let errorMsg = 'ToXDR of ' + msg.switch().name + ' failed';
            if (error instanceof Error)
                errorMsg += ': ' + error.message;
            return (0, neverthrow_1.err)(new Error(errorMsg));
        }
    }
};
