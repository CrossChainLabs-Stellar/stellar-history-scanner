"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationV1Schema = void 0;
const nullable_1 = require("./helper/nullable");
exports.OrganizationV1Schema = {
    $id: 'organization-v1.json',
    $schema: 'http://json-schema.org/draft-07/schema#',
    properties: {
        dateDiscovered: {
            format: 'date-time',
            type: 'string'
        },
        dba: (0, nullable_1.nullable)({
            type: 'string'
        }),
        description: (0, nullable_1.nullable)({
            type: 'string'
        }),
        github: (0, nullable_1.nullable)({
            type: 'string'
        }),
        has24HourStats: {
            type: 'boolean'
        },
        has30DayStats: {
            type: 'boolean'
        },
        horizonUrl: (0, nullable_1.nullable)({
            type: 'string'
        }),
        id: {
            type: 'string'
        },
        homeDomain: {
            type: 'string'
        },
        hasReliableUptime: {
            type: 'boolean'
        },
        keybase: (0, nullable_1.nullable)({
            type: 'string'
        }),
        logo: (0, nullable_1.nullable)({
            type: 'string'
        }),
        name: (0, nullable_1.nullable)({
            type: 'string'
        }),
        officialEmail: (0, nullable_1.nullable)({
            type: 'string'
        }),
        phoneNumber: (0, nullable_1.nullable)({
            type: 'string'
        }),
        physicalAddress: (0, nullable_1.nullable)({
            type: 'string'
        }),
        subQuorum24HoursAvailability: {
            type: 'number'
        },
        subQuorum30DaysAvailability: {
            type: 'number'
        },
        subQuorumAvailable: {
            type: 'boolean'
        },
        twitter: (0, nullable_1.nullable)({
            type: 'string'
        }),
        url: (0, nullable_1.nullable)({
            type: 'string'
        }),
        tomlState: {
            type: 'string'
        },
        validators: {
            items: {
                type: 'string'
            },
            type: 'array'
        }
    },
    type: 'object',
    required: [
        'id',
        'validators',
        'subQuorumAvailable',
        'has30DayStats',
        'has24HourStats',
        'subQuorum24HoursAvailability',
        'subQuorum30DaysAvailability',
        'dateDiscovered',
        'hasReliableUptime',
        'dba',
        'description',
        'github',
        'horizonUrl',
        'keybase',
        'logo',
        'name',
        'officialEmail',
        'phoneNumber',
        'physicalAddress',
        'twitter',
        'url',
        'homeDomain',
        'tomlState'
    ]
};
