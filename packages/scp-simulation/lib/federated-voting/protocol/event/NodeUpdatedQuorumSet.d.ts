import { PublicKey, QuorumSet } from '../../../core';
import { ProtocolEvent } from './ProtocolEvent';
export declare class NodeUpdatedQuorumSet extends ProtocolEvent {
    readonly publicKey: PublicKey;
    readonly quorumSet: QuorumSet;
    readonly subType = "NodeUpdatedQuorumSet";
    constructor(publicKey: PublicKey, quorumSet: QuorumSet);
    toString(): string;
}
//# sourceMappingURL=NodeUpdatedQuorumSet.d.ts.map