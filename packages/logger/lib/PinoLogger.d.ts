import { pino } from 'pino';
import { logFn, Logger } from './Logger';
export declare class PinoLogger implements Logger {
    pino: pino.Logger;
    constructor(logLevel?: string);
    getRawLogger(): pino.Logger<never, boolean>;
    debug: logFn;
    trace: logFn;
    info: logFn;
    warn: logFn;
    error: logFn;
    fatal: logFn;
    protected forward(method: string, message: string, context?: Record<string, unknown>): void;
}
//# sourceMappingURL=PinoLogger.d.ts.map