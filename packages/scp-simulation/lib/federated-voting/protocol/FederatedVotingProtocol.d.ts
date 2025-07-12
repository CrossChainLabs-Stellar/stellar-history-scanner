import { Statement } from './Statement';
import { Vote } from './Vote';
import { FederatedVotingProtocolState } from './FederatedVotingProtocolState';
import { PhaseTransitioner } from './phase-transitioner/PhaseTransitioner';
import { InMemoryEventCollector } from '../../core';
export declare class FederatedVotingProtocol extends InMemoryEventCollector {
    private phaseTransitioner;
    constructor(phaseTransitioner: PhaseTransitioner);
    vote(statement: Statement, state: FederatedVotingProtocolState): void;
    private voteToAcceptStatement;
    processVote(vote: Vote, state: FederatedVotingProtocolState): void;
}
//# sourceMappingURL=FederatedVotingProtocol.d.ts.map