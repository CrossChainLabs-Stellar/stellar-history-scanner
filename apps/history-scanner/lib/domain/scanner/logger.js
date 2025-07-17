"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWithTimestamp = logWithTimestamp;
function logWithTimestamp(message, ...params) {
    const ts = new Date().toISOString();
    console.log(`[${ts}] ${message}`, ...params);
}
