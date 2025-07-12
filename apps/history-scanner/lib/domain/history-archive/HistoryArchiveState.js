"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryArchiveStateSchema = void 0;
exports.HistoryArchiveStateSchema = {
    type: 'object',
    properties: {
        version: { type: 'integer' },
        server: { type: 'string' },
        currentLedger: { type: 'number' },
        networkPassphrase: { type: 'string', nullable: true },
        currentBuckets: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    curr: { type: 'string' },
                    snap: { type: 'string' },
                    next: {
                        type: 'object',
                        properties: {
                            state: { type: 'number' },
                            output: { type: 'string', nullable: true }
                        },
                        required: ['state']
                    }
                },
                required: ['curr', 'snap', 'next']
            },
            minItems: 0
        }
    },
    required: ['version', 'server', 'currentLedger', 'currentBuckets']
};
