import { Node } from '../../core';
import { Statement } from './Statement';
import { Vote } from './Vote';
export declare enum FederatedVotingPhase {
    unknown = "unknown",
    accepted = "accepted",
    confirmed = "confirmed"
}
export declare class FederatedVotingProtocolState {
    readonly node: Node;
    processedVotes: Vote[];
    voted: Statement | null;
    accepted: Statement | null;
    confirmed: Statement | null;
    phase: FederatedVotingPhase;
    constructor(node: Node);
}
//# sourceMappingURL=FederatedVotingProtocolState.d.ts.map