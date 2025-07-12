import { QuorumSet } from 'shared';
import * as P from 'pino';
import { Slot, SlotIndex } from './slot';
export declare class Slots {
    protected logger: P.Logger;
    protected slots: Map<SlotIndex, Slot>;
    protected trustedQuorumSet: QuorumSet;
    constructor(trustedQuorumSet: QuorumSet, logger: P.Logger);
    getSlot(slotIndex: SlotIndex): Slot;
    getConfirmedClosedSlotIndexes(): bigint[];
}
//# sourceMappingURL=slots.d.ts.map