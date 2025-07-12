"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUnknownToError = mapUnknownToError;
function mapUnknownToError(e) {
    if (e instanceof Error) {
        return e;
    }
    if (isString(e)) {
        return new Error(e);
    }
    return new Error('Unspecified error: ' + e);
}
function isString(param) {
    return typeof param === 'string';
}
