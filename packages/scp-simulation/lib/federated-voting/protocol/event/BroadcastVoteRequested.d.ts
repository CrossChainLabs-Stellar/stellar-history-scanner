import { PublicKey } from '../../../core';
import { ProtocolEvent } from './ProtocolEvent';
import { Vote } from '../Vote';
export declare class BroadcastVoteRequested extends ProtocolEvent {
    readonly publicKey: PublicKey;
    readonly vote: Vote;
    readonly subType = "BroadCastVoteRequested";
    constructor(publicKey: PublicKey, vote: Vote);
    toString(): string;
}
//# sourceMappingURL=BroadcastVoteRequested.d.ts.map