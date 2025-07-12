import { PeerNode } from './peer-node';
import { NodeInfo } from 'node-connector';
import { Ledger } from './crawler';
type PublicKey = string;
export declare class PeerNodeCollection {
    private peerNodes;
    constructor(peerNodes?: Map<string, PeerNode>);
    addExternalizedValueForPeerNode(publicKey: string, slotIndex: bigint, value: string, localTime: Date): void;
    getOrAdd(publicKey: string): PeerNode;
    get(publicKey: string): PeerNode | undefined;
    addSuccessfullyConnected(publicKey: string, ip: string, port: number, nodeInfo: NodeInfo): PeerNode | Error;
    getAll(): Map<string, PeerNode>;
    values(): MapIterator<PeerNode>;
    get size(): number;
    setPeerOverloaded(publicKey: PublicKey, overloaded: boolean): void;
    setPeerSuppliedPeerList(publicKey: PublicKey, suppliedPeerList: boolean): void;
    confirmLedgerCloseForNode(publicKey: PublicKey, closedLedger: Ledger): void;
    confirmLedgerCloseForDisagreeingNodes(disagreeingNodes: Set<PublicKey>): void;
    confirmLedgerCloseForValidatingNodes(validatingNodes: Set<PublicKey>, ledger: Ledger): void;
}
export {};
//# sourceMappingURL=peer-node-collection.d.ts.map