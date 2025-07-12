"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryJobMonitor = void 0;
const Sentry = __importStar(require("@sentry/node"));
require("reflect-metadata");
const neverthrow_1 = require("neverthrow");
const shared_1 = require("shared");
class SentryJobMonitor {
    checkInId = null;
    constructor(sentryDSN) {
        Sentry.init({
            dsn: sentryDSN
        });
    }
    async checkIn(job) {
        try {
            if (job.status === 'in_progress') {
                this.checkInId = Sentry.captureCheckIn({
                    monitorSlug: job.context,
                    status: job.status
                });
                return (0, neverthrow_1.ok)(undefined);
            }
            if (!this.checkInId) {
                return (0, neverthrow_1.err)(new Error('Cannot check in or fail a job that has not been started'));
            }
            Sentry.captureCheckIn({
                monitorSlug: job.context,
                status: job.status,
                checkInId: this.checkInId
            });
            this.checkInId = null;
            return (0, neverthrow_1.ok)(undefined);
        }
        catch (error) {
            return (0, neverthrow_1.err)((0, shared_1.mapUnknownToError)(error));
        }
    }
}
exports.SentryJobMonitor = SentryJobMonitor;
