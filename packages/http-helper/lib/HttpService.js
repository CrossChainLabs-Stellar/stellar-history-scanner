"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
exports.isHttpError = isHttpError;
const custom_error_1 = require("custom-error");
function isHttpError(payload) {
    return payload instanceof HttpError;
}
class HttpError extends custom_error_1.CustomError {
    code;
    response;
    constructor(message, code, response) {
        super(message ?? '', HttpError.name);
        this.code = code;
        this.response = response;
        this.name = 'HttpError';
    }
}
exports.HttpError = HttpError;
