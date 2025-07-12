"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigFromEnv = void 0;
const dotenv_1 = require("dotenv");
const neverthrow_1 = require("neverthrow");
const yn_1 = __importDefault(require("yn"));
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)({
    path: path_1.default.resolve(__dirname + '../../../../.env')
});
// Default values
const defaultConfig = {
    nodeEnv: 'development',
    enableSentry: false,
    userAgent: 'stellarbeat-history-scanner',
    logLevel: 'info',
    historyMaxFileMs: 60000,
    historySlowArchiveMaxLedgers: 1000
};
function getConfigFromEnv() {
    // Required env vars validation
    const required = [
        'COORDINATOR_API_BASE_URL',
        'COORDINATOR_API_USERNAME',
        'COORDINATOR_API_PASSWORD'
    ];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length) {
        return (0, neverthrow_1.err)(new Error(`Missing required env vars: ${missing.join(', ')}`));
    }
    // Optional vars with validation
    const enableSentry = (0, yn_1.default)(process.env.ENABLE_SENTRY) ?? defaultConfig.enableSentry;
    if (enableSentry && !process.env.SENTRY_DSN) {
        return (0, neverthrow_1.err)(new Error('SENTRY_DSN required when ENABLE_SENTRY is true'));
    }
    const historyMaxFileMs = process.env.HISTORY_MAX_FILE_MS
        ? Number(process.env.HISTORY_MAX_FILE_MS)
        : defaultConfig.historyMaxFileMs;
    if (isNaN(historyMaxFileMs)) {
        return (0, neverthrow_1.err)(new Error('HISTORY_MAX_FILE_MS must be a number'));
    }
    const historySlowArchiveMaxLedgers = process.env
        .HISTORY_SLOW_ARCHIVE_MAX_LEDGERS
        ? Number(process.env.HISTORY_SLOW_ARCHIVE_MAX_LEDGERS)
        : defaultConfig.historySlowArchiveMaxLedgers;
    if (isNaN(historySlowArchiveMaxLedgers)) {
        return (0, neverthrow_1.err)(new Error('HISTORY_SLOW_ARCHIVE_MAX_LEDGERS must be a number'));
    }
    return (0, neverthrow_1.ok)({
        nodeEnv: process.env.NODE_ENV ?? defaultConfig.nodeEnv,
        enableSentry,
        sentryDSN: enableSentry ? process.env.SENTRY_DSN : undefined,
        userAgent: process.env.USER_AGENT ?? defaultConfig.userAgent,
        coordinatorAPIBaseUrl: process.env.COORDINATOR_API_BASE_URL,
        coordinatorAPIPassword: process.env.COORDINATOR_API_PASSWORD,
        coordinatorAPIUsername: process.env.COORDINATOR_API_USERNAME,
        logLevel: process.env.LOG_LEVEL ?? defaultConfig.logLevel,
        historyMaxFileMs,
        historySlowArchiveMaxLedgers
    });
}
exports.getConfigFromEnv = getConfigFromEnv;
