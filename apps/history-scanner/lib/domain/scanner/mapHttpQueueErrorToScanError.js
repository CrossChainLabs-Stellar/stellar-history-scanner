"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapHttpQueueErrorToScanError = mapHttpQueueErrorToScanError;
const http_helper_1 = require("http-helper");
require("reflect-metadata");
const ScanError_1 = require("../scan/ScanError");
function mapHttpQueueErrorToScanError(error) {
    if (error instanceof http_helper_1.FileNotFoundError) {
        return new ScanError_1.ScanError(ScanError_1.ScanErrorType.TYPE_VERIFICATION, error.request.url.value, 'File not found');
    }
    if (error.cause instanceof ScanError_1.ScanError) {
        return error.cause;
    }
    return new ScanError_1.ScanError(ScanError_1.ScanErrorType.TYPE_CONNECTION, error.request.url.value, error.cause?.message ?? 'Connection error');
}
