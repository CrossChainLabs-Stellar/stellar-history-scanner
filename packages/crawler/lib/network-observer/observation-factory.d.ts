import { Observation } from './observation';
import { NodeAddress } from '../node-address';
import { PeerNodeCollection } from '../peer-node-collection';
import { Slots } from './peer-event-handler/stellar-message-handlers/scp-envelope/scp-statement/externalize/slots';
import { QuorumSet } from 'shared';
import { Ledger } from '../crawler';
export declare class ObservationFactory {
    createObservation(network: string, slots: Slots, topTierAddresses: NodeAddress[], peerNodes: PeerNodeCollection, latestConfirmedClosedLedger: Ledger, quorumSets: Map<string, QuorumSet>): Observation;
}
//# sourceMappingURL=observation-factory.d.ts.map