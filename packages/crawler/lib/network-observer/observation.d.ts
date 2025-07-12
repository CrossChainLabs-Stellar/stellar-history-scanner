import { NodeAddress } from '../node-address';
import { PeerNodeCollection } from '../peer-node-collection';
import { Ledger } from '../crawler';
import { ObservationState } from './observation-state';
import { Slots } from './peer-event-handler/stellar-message-handlers/scp-envelope/scp-statement/externalize/slots';
import { QuorumSet } from 'shared';
import { QuorumSetState } from './quorum-set-state';
import { LRUCache } from 'lru-cache';
export declare class Observation {
    network: string;
    topTierAddresses: NodeAddress[];
    peerNodes: PeerNodeCollection;
    latestConfirmedClosedLedger: Ledger;
    quorumSets: Map<string, QuorumSet>;
    slots: Slots;
    state: ObservationState;
    private networkHalted;
    topTierAddressesSet: Set<string>;
    envelopeCache: LRUCache<string, number>;
    quorumSetState: QuorumSetState;
    constructor(network: string, topTierAddresses: NodeAddress[], peerNodes: PeerNodeCollection, latestConfirmedClosedLedger: Ledger, quorumSets: Map<string, QuorumSet>, slots: Slots);
    private mapTopTierAddresses;
    moveToSyncingState(): void;
    moveToSyncedState(): void;
    moveToStoppingState(): void;
    moveToStoppedState(): void;
    ledgerCloseConfirmed(ledger: Ledger): void;
    isNetworkHalted(): boolean;
    setNetworkHalted(): void;
}
//# sourceMappingURL=observation.d.ts.map