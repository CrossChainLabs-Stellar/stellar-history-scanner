import { Statement } from '../Statement';
import { FederatedVotingProtocolState } from '../FederatedVotingProtocolState';
import { InMemoryEventCollector } from '../../../core';
export declare class PhaseTransitioner extends InMemoryEventCollector {
    tryMoveToAcceptPhase(statement: Statement, state: FederatedVotingProtocolState): boolean;
    tryMoveToConfirmPhase(statement: Statement, state: FederatedVotingProtocolState): boolean;
    private areAcceptingNodesVBlocking;
    private isVoteRatified;
    private filterVotesForStatement;
    private filterVotesToAccept;
}
//# sourceMappingURL=PhaseTransitioner.d.ts.map