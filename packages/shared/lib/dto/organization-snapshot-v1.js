"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSnapshotV1Schema = void 0;
exports.OrganizationSnapshotV1Schema = {
    "$id": "organization-snapshot-v1.json",
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
        "organization": {
            "$ref": "organization-v1.json"
        }
    },
    "type": "object",
    "required": [
        "startDate",
        "endDate",
        "organization"
    ]
};
