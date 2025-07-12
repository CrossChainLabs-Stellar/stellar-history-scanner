"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanError = exports.ScanErrorType = void 0;
var ScanErrorType;
(function (ScanErrorType) {
    ScanErrorType[ScanErrorType["TYPE_VERIFICATION"] = 0] = "TYPE_VERIFICATION";
    ScanErrorType[ScanErrorType["TYPE_CONNECTION"] = 1] = "TYPE_CONNECTION";
})(ScanErrorType || (exports.ScanErrorType = ScanErrorType = {}));
class ScanError {
    name = 'ScanError';
    type;
    url;
    message;
    constructor(type, url, message) {
        this.type = type;
        this.url = url;
        this.message = message;
    }
    equals(other) {
        return (this.type === other.type &&
            this.url === other.url &&
            this.message === other.message);
    }
}
exports.ScanError = ScanError;
