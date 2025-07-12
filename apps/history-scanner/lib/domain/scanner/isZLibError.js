"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isZLibError = isZLibError;
const shared_1 = require("shared");
function isZLibError(error) {
    return ((0, shared_1.isObject)(error) &&
        Number.isInteger(error.errno) &&
        (0, shared_1.isString)(error.code) &&
        (0, shared_1.isString)(error.message));
}
