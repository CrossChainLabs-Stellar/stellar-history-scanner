"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncate = truncate;
function truncate(str) {
    if (!str)
        return str;
    return str.length > 20
        ? str.substring(0, 5) + '...' + str.substring(str.length - 5, str.length)
        : str;
}
