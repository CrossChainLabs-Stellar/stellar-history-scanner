import { ClosePayload, ConnectedPayload, DataPayload } from '../connection-manager';
import { Ledger } from '../../crawler';
import { NodeAddress } from '../../node-address';
import { OnPeerConnected } from './on-peer-connected';
import { OnPeerConnectionClosed } from './on-peer-connection-closed';
import { OnPeerData } from './on-peer-data';
import { Observation } from '../observation';
export declare class PeerEventHandler {
    private onConnectedHandler;
    private onConnectionCloseHandler;
    private onPeerDataHandler;
    constructor(onConnectedHandler: OnPeerConnected, onConnectionCloseHandler: OnPeerConnectionClosed, onPeerDataHandler: OnPeerData);
    onConnected(data: ConnectedPayload, observation: Observation): void;
    onConnectionClose(data: ClosePayload, observation: Observation): void;
    onData(data: DataPayload, observation: Observation): {
        closedLedger: Ledger | null;
        peers: NodeAddress[];
    };
}
//# sourceMappingURL=peer-event-handler.d.ts.map