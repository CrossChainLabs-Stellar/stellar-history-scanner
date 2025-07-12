"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryArchiveScanV1Schema = void 0;
const nullable_1 = require("./helper/nullable");
exports.HistoryArchiveScanV1Schema = {
    "$id": "history-scan-v1.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "startDate": {
            "format": "date-time",
            "type": "string"
        },
        "endDate": {
            "format": "date-time",
            "type": "string"
        },
        "url": {
            "type": "string"
        },
        "latestVerifiedLedger": {
            "type": "number"
        },
        "hasError": {
            "type": "boolean"
        },
        "errorUrl": (0, nullable_1.nullable)({
            "type": "string"
        }),
        "errorMessage": (0, nullable_1.nullable)({
            "type": "string"
        }),
        "isSlow": {
            "type": "boolean"
        }
    },
    "type": "object",
    "required": [
        "url",
        "startDate",
        "endDate",
        "hasError",
        "latestVerifiedLedger",
        "isSlow",
        "errorUrl",
        "errorMessage"
    ]
};
