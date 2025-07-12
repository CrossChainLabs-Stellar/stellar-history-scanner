import { ExceptionLogger } from './ExceptionLogger';
import { Logger } from 'logger';
export declare class SentryExceptionLogger implements ExceptionLogger {
    protected logger: Logger;
    constructor(sentryDSN: string, logger: Logger);
    captureException(error: Error, extra?: Record<string, unknown>): void;
}
//# sourceMappingURL=SentryExceptionLogger.d.ts.map