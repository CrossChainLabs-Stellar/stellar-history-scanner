"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCloseTimeFromValue = extractCloseTimeFromValue;
const stellar_base_1 = require("@stellar/stellar-base");
function extractCloseTimeFromValue(value) {
    try {
        return new Date(1000 *
            Number(stellar_base_1.xdr.StellarValue.fromXDR(value).closeTime().toXDR().readBigUInt64BE()));
    }
    catch (error) {
        return new Date();
    }
}
