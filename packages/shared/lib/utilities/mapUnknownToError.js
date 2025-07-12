"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUnknownToError = mapUnknownToError;
const typeguards_1 = require("../typeguards");
function mapUnknownToError(e) {
    if (e instanceof Error) {
        return e;
    }
    if ((0, typeguards_1.isString)(e)) {
        return new Error(e);
    }
    return new Error('Unspecified error: ' + e);
}
