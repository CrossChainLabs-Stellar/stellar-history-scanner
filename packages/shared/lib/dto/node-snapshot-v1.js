"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeSnapshotV1Schema = void 0;
exports.NodeSnapshotV1Schema = {
    "$id": "node-snapshot-v1.json",
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
        "node": {
            "$ref": "node-v1.json"
        }
    },
    "type": "object",
    "required": [
        "startDate",
        "endDate",
        "node"
    ]
};
