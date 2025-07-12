import { Result } from 'neverthrow';
export interface Config {
    nodeEnv: string;
    enableSentry: boolean;
    sentryDSN?: string;
    userAgent: string;
    coordinatorAPIBaseUrl: string;
    coordinatorAPIPassword: string;
    coordinatorAPIUsername: string;
    logLevel: string;
    historyMaxFileMs: number;
    historySlowArchiveMaxLedgers: number;
}
export declare function getConfigFromEnv(): Result<Config, Error>;
//# sourceMappingURL=Config.d.ts.map