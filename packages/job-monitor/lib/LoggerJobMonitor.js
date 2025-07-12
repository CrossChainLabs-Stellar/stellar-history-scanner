"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerJobMonitor = void 0;
const neverthrow_1 = require("neverthrow");
class LoggerJobMonitor {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    async checkIn(job) {
        this.logger.info('Job check-in', {
            job
        });
        return (0, neverthrow_1.ok)(undefined);
    }
}
exports.LoggerJobMonitor = LoggerJobMonitor;
