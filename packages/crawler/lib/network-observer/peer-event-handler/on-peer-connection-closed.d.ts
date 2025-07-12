import { ClosePayload } from '../connection-manager';
import { QuorumSetManager } from '../quorum-set-manager';
import { P } from 'pino';
import { Observation } from '../observation';
export declare class OnPeerConnectionClosed {
    private quorumSetManager;
    private logger;
    constructor(quorumSetManager: QuorumSetManager, logger: P.Logger);
    handle(data: ClosePayload, observation: Observation): void;
    private logIfTopTierDisconnect;
}
//# sourceMappingURL=on-peer-connection-closed.d.ts.map