import { StragglerTimer } from './straggler-timer';
import { ConnectionManager } from './connection-manager';
import { P } from 'pino';
import { Ledger } from '../crawler';
import { Observation } from './observation';
import { ConsensusTimer } from './consensus-timer';
export declare class ObservationManager {
    private connectionManager;
    private consensusTimer;
    private stragglerTimer;
    private syncingTimeoutMS;
    private logger;
    constructor(connectionManager: ConnectionManager, consensusTimer: ConsensusTimer, stragglerTimer: StragglerTimer, syncingTimeoutMS: number, logger: P.Logger);
    startSync(observation: Observation): Promise<void>;
    private syncCompleted;
    ledgerCloseConfirmed(observation: Observation, ledger: Ledger): void;
    private startNetworkConsensusTimer;
    private onNetworkHalted;
    stopObservation(observation: Observation, onStoppedCallback: () => void): void;
    private onLastNodesDisconnected;
    private startNetworkConsensusTimerInternal;
    private connectToTopTierNodes;
    private timeout;
}
//# sourceMappingURL=observation-manager.d.ts.map