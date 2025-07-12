import { ConnectedPayload, ConnectionManager } from '../connection-manager';
import { StragglerTimer } from '../straggler-timer';
import { P } from 'pino';
import { Observation } from '../observation';
export declare class OnPeerConnected {
    private stragglerHandler;
    private connectionManager;
    private logger;
    constructor(stragglerHandler: StragglerTimer, connectionManager: ConnectionManager, logger: P.Logger);
    handle(data: ConnectedPayload, observation: Observation): void | Error;
    private handleConnectedByState;
    private disconnectBecauseIdle;
    private createIdleConnectedError;
    private collectMinimalDataAndDisconnect;
    private startStragglerTimeout;
    private disconnect;
    private addPeerNode;
    private logIfTopTierConnected;
}
//# sourceMappingURL=on-peer-connected.d.ts.map