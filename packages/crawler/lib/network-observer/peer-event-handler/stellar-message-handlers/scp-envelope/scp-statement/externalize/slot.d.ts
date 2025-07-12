import { Ledger } from '../../../../../../crawler';
import { QuorumSet } from 'shared';
import * as P from 'pino';
export type SlotIndex = bigint;
type NodeId = string;
type SlotValue = string;
export declare class Slot {
    private logger;
    index: SlotIndex;
    private confirmedClosedLedger?;
    protected valuesMap: Map<string, Set<string>>;
    protected localCloseTimeMap: Map<string, Date>;
    protected trustedQuorumSet: QuorumSet;
    protected closeTime?: Date;
    protected localCloseTime?: Date;
    constructor(index: SlotIndex, trustedQuorumSet: QuorumSet, logger: P.Logger);
    getNodesAgreeingOnExternalizedValue(): Set<NodeId>;
    getNodesDisagreeingOnExternalizedValue(): Set<NodeId>;
    addExternalizeValue(nodeId: NodeId, value: SlotValue, localCloseTime: Date): void;
    getConfirmedClosedLedger(): Ledger | undefined;
    confirmedClosed(): boolean;
}
export {};
//# sourceMappingURL=slot.d.ts.map