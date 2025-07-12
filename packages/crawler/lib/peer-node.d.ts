import { QuorumSet } from 'shared';
import { NodeInfo } from 'node-connector';
import { Ledger } from './crawler';
export declare class PeerNode {
    ip?: string;
    port?: number;
    publicKey: string;
    nodeInfo?: NodeInfo;
    isValidating: boolean;
    isValidatingIncorrectValues: boolean;
    overLoaded: boolean;
    quorumSetHash: string | undefined;
    quorumSet: QuorumSet | undefined;
    suppliedPeerList: boolean;
    latestActiveSlotIndex?: string;
    participatingInSCP: boolean;
    successfullyConnected: boolean;
    private externalizedValues;
    private lagMSMeasurement;
    constructor(publicKey: string);
    get key(): string;
    processConfirmedLedgerClose(closedLedger: Ledger): void;
    addExternalizedValue(slotIndex: bigint, localTime: Date, value: string): void;
    private updateLag;
    private determineLag;
    getMinLagMS(): number | undefined;
}
//# sourceMappingURL=peer-node.d.ts.map