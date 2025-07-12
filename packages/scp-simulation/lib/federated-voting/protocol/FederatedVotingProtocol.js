"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederatedVotingProtocol = void 0;
const Vote_1 = require("./Vote");
const BroadcastVoteRequested_1 = require("./event/BroadcastVoteRequested");
const Voted_1 = require("./event/Voted");
const ConsensusReached_1 = require("./event/ConsensusReached");
const core_1 = require("../../core");
class FederatedVotingProtocol extends core_1.InMemoryEventCollector {
    phaseTransitioner;
    constructor(phaseTransitioner) {
        super();
        this.phaseTransitioner = phaseTransitioner;
    }
    vote(statement, state) {
        if (state.voted !== null)
            return;
        const vote = new Vote_1.Vote(statement, false, state.node.publicKey, state.node.quorumSet);
        state.voted = statement;
        this.registerEvent(new Voted_1.Voted(state.node.publicKey, vote));
        this.registerEvent(new BroadcastVoteRequested_1.BroadcastVoteRequested(state.node.publicKey, vote));
        this.processVote(vote, state);
    }
    //vote(accept(statement))
    //can only happen due to processing of a vote, thus private
    voteToAcceptStatement(statement, state) {
        const vote = new Vote_1.Vote(statement, true, state.node.publicKey, state.node.quorumSet);
        this.registerEvent(new Voted_1.Voted(state.node.publicKey, vote));
        this.registerEvent(new BroadcastVoteRequested_1.BroadcastVoteRequested(state.node.publicKey, vote));
        this.processVote(vote, state);
    }
    processVote(vote, state) {
        if (state.processedVotes.includes(vote))
            return; //because we are doing everything in memory, this check suffices and we don't need hashes
        state.processedVotes.push(vote);
        if (this.phaseTransitioner.tryMoveToAcceptPhase(vote.statement, state)) {
            this.registerEvents(this.phaseTransitioner.drainEvents());
            this.voteToAcceptStatement(vote.statement, state);
        }
        if (this.phaseTransitioner.tryMoveToConfirmPhase(vote.statement, state)) {
            this.registerEvents(this.phaseTransitioner.drainEvents());
            state.confirmed = vote.statement;
            this.registerEvent(new ConsensusReached_1.ConsensusReached(state.node.publicKey, state.confirmed));
        }
    }
}
exports.FederatedVotingProtocol = FederatedVotingProtocol;
