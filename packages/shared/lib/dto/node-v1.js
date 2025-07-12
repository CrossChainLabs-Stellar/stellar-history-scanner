"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeV1Schema = void 0;
const nullable_1 = require("./helper/nullable");
exports.NodeV1Schema = {
    $id: 'node-v1.json',
    $schema: 'http://json-schema.org/draft-07/schema#',
    properties: {
        active: {
            default: false,
            type: 'boolean',
            description: 'Node accepts connections from other nodes'
        },
        activeInScp: {
            default: false,
            type: 'boolean',
            description: 'Node is active in SCP'
        },
        alias: (0, nullable_1.nullable)({
            type: 'string'
        }),
        dateDiscovered: {
            format: 'date-time',
            type: 'string'
        },
        dateUpdated: {
            format: 'date-time',
            type: 'string'
        },
        geoData: {
            $ref: '#/definitions/NodeGeoDataV1'
        },
        historyUrl: (0, nullable_1.nullable)({
            type: 'string'
        }),
        homeDomain: (0, nullable_1.nullable)({
            type: 'string'
        }),
        lag: (0, nullable_1.nullable)({
            type: 'number'
        }),
        host: (0, nullable_1.nullable)({ type: 'string' }),
        index: {
            default: 0,
            type: 'number',
            description: 'Used to compare nodes. The more trustworthy, the higher the index.'
        },
        ip: {
            default: '127.0.0.1',
            type: 'string'
        },
        isFullValidator: {
            default: false,
            type: 'boolean'
        },
        isValidating: {
            default: false,
            type: 'boolean',
            description: 'Participating in SCP and externalizing new values'
        },
        isValidator: {
            type: 'boolean'
        },
        isp: (0, nullable_1.nullable)({
            type: 'string'
        }),
        ledgerVersion: (0, nullable_1.nullable)({
            type: 'number'
        }),
        name: (0, nullable_1.nullable)({ type: 'string' }),
        organizationId: (0, nullable_1.nullable)({
            type: 'string'
        }),
        overLoaded: {
            type: 'boolean',
            description: 'When node disconnects with err_load'
        },
        overlayMinVersion: (0, nullable_1.nullable)({
            type: 'number'
        }),
        overlayVersion: (0, nullable_1.nullable)({
            type: 'number'
        }),
        port: {
            type: 'number'
        },
        publicKey: {
            type: 'string'
        },
        quorumSet: { $ref: '#/definitions/BaseQuorumSet' },
        quorumSetHashKey: (0, nullable_1.nullable)({ type: 'string' }),
        statistics: {
            $ref: '#/definitions/NodeStatisticsV1'
        },
        versionStr: (0, nullable_1.nullable)({
            type: 'string'
        }),
        historyArchiveHasError: {
            type: 'boolean'
        },
        connectivityError: {
            type: 'boolean'
        },
        stellarCoreVersionBehind: {
            type: 'boolean'
        }
    },
    type: 'object',
    required: [
        'publicKey',
        'organizationId',
        'alias',
        'name',
        'host',
        'ip',
        'port',
        'ledgerVersion',
        'historyUrl',
        'overlayVersion',
        'overlayMinVersion',
        'versionStr',
        'active',
        'activeInScp',
        'dateDiscovered',
        'dateUpdated',
        'overLoaded',
        'isFullValidator',
        'isValidating',
        'index',
        'isp',
        'isValidator',
        'historyArchiveHasError',
        'quorumSetHashKey',
        'quorumSet',
        'statistics',
        'geoData',
        'homeDomain'
    ],
    definitions: {
        NodeGeoDataV1: {
            properties: {
                countryCode: (0, nullable_1.nullable)({
                    type: 'string'
                }),
                countryName: (0, nullable_1.nullable)({
                    type: 'string'
                }),
                latitude: (0, nullable_1.nullable)({
                    type: 'number'
                }),
                longitude: (0, nullable_1.nullable)({
                    type: 'number'
                })
            },
            type: 'object',
            nullable: true,
            required: ['countryCode', 'countryName', 'latitude', 'longitude']
        },
        NodeStatisticsV1: {
            properties: {
                active24HoursPercentage: {
                    default: 0,
                    type: 'number'
                },
                active30DaysPercentage: {
                    default: 0,
                    type: 'number'
                },
                has24HourStats: {
                    default: false,
                    type: 'boolean'
                },
                has30DayStats: {
                    default: false,
                    type: 'boolean'
                },
                overLoaded24HoursPercentage: {
                    default: 0,
                    type: 'number'
                },
                overLoaded30DaysPercentage: {
                    default: 0,
                    type: 'number'
                },
                validating24HoursPercentage: {
                    default: 0,
                    type: 'number'
                },
                validating30DaysPercentage: {
                    default: 0,
                    type: 'number'
                }
            },
            type: 'object',
            required: [
                'active24HoursPercentage',
                'active30DaysPercentage',
                'has24HourStats',
                'has30DayStats',
                'overLoaded24HoursPercentage',
                'overLoaded30DaysPercentage',
                'validating24HoursPercentage',
                'validating30DaysPercentage'
            ]
        },
        BaseQuorumSet: {
            properties: {
                innerQuorumSets: {
                    type: 'array',
                    items: {
                        $ref: '#/definitions/BaseQuorumSet',
                        type: 'object',
                        required: []
                    }
                },
                threshold: {
                    type: 'number'
                },
                validators: {
                    items: {
                        type: 'string'
                    },
                    type: 'array'
                }
            },
            type: 'object',
            nullable: true,
            required: ['threshold', 'validators', 'innerQuorumSets']
        }
    }
};
