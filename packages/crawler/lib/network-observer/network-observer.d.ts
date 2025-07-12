import { ConnectionManager } from './connection-manager';
import { QuorumSetManager } from './quorum-set-manager';
import { EventEmitter } from 'events';
import { ObservationManager } from './observation-manager';
import { PeerEventHandler } from './peer-event-handler/peer-event-handler';
import { Observation } from './observation';
import { ObservationFactory } from './observation-factory';
export declare class NetworkObserver extends EventEmitter {
    private observationFactory;
    private connectionManager;
    private quorumSetManager;
    private peerEventHandler;
    private observationManager;
    private _observation;
    constructor(observationFactory: ObservationFactory, connectionManager: ConnectionManager, quorumSetManager: QuorumSetManager, peerEventHandler: PeerEventHandler, observationManager: ObservationManager);
    startObservation(observation: Observation): Promise<number>;
    connectToNode(ip: string, port: number): void;
    stop(): Promise<Observation>;
    private onObservationStopped;
    private setupPeerEventHandlers;
    private onPeerData;
    private get observation();
}
//# sourceMappingURL=network-observer.d.ts.map