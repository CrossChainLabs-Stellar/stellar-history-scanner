import { ConnectionManager } from './connection-manager';
import { P } from 'pino';
import { Timers } from '../utilities/timers';
export declare class StragglerTimer {
    private connectionManager;
    private timers;
    private straggleTimeoutMS;
    private logger;
    constructor(connectionManager: ConnectionManager, timers: Timers, straggleTimeoutMS: number, logger: P.Logger);
    startStragglerTimeoutForActivePeers(includeTopTier: boolean | undefined, topTierAddresses: Set<string>, done?: () => void): void;
    startStragglerTimeout(addresses: string[], done?: () => void): void;
    stopStragglerTimeouts(): void;
}
//# sourceMappingURL=straggler-timer.d.ts.map