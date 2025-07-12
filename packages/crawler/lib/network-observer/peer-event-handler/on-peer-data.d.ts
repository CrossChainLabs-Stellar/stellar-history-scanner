import { ConnectionManager, DataPayload } from '../connection-manager';
import { Ledger } from '../../crawler';
import { NodeAddress } from '../../node-address';
import { StellarMessageHandler } from './stellar-message-handlers/stellar-message-handler';
import { P } from 'pino';
import { Observation } from '../observation';
export interface OnPeerDataResult {
    closedLedger: Ledger | null;
    peers: NodeAddress[];
}
export declare class OnPeerData {
    private stellarMessageHandler;
    private logger;
    private connectionManager;
    constructor(stellarMessageHandler: StellarMessageHandler, logger: P.Logger, connectionManager: ConnectionManager);
    handle(data: DataPayload, observation: Observation): OnPeerDataResult;
    private createOnPeerDataResult;
    private performWork;
    private attemptLedgerClose;
    private returnEmpty;
    private disconnect;
}
//# sourceMappingURL=on-peer-data.d.ts.map