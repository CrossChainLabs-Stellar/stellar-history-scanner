"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhaseTransitioner = void 0;
const TransitionedToAcceptPhase_1 = require("./event/TransitionedToAcceptPhase");
const VoteRatified_1 = require("./event/VoteRatified");
const AcceptVoteRatified_1 = require("./event/AcceptVoteRatified");
const AcceptVoteVBlocked_1 = require("./event/AcceptVoteVBlocked");
const TransitionedToConfirmPhase_1 = require("./event/TransitionedToConfirmPhase");
const FederatedVotingProtocolState_1 = require("../FederatedVotingProtocolState");
const QuorumSetService_1 = require("../QuorumSetService");
const QuorumService_1 = require("../QuorumService");
const core_1 = require("../../../core");
class PhaseTransitioner extends core_1.InMemoryEventCollector {
    tryMoveToAcceptPhase(statement, state) {
        if (state.phase !== FederatedVotingProtocolState_1.FederatedVotingPhase.unknown) {
            return false;
        }
        const votesToAcceptStatement = this.filterVotesToAccept(state, statement);
        if (this.areAcceptingNodesVBlocking(state.node.quorumSet, votesToAcceptStatement.map((vote) => vote.publicKey))) {
            this.registerEvent(new AcceptVoteVBlocked_1.AcceptVoteVBlocked(state.node.publicKey, statement, new Set(votesToAcceptStatement.map((vote) => vote.publicKey))));
            state.phase = FederatedVotingProtocolState_1.FederatedVotingPhase.accepted;
            state.accepted = statement;
            this.registerEvent(new TransitionedToAcceptPhase_1.TransitionedToAcceptPhase(state.node.publicKey, state.phase, state.accepted));
            return true;
        }
        const votesForStatement = this.filterVotesForStatement(state, statement);
        const quorumOrNull = this.isVoteRatified(state, votesForStatement);
        if (quorumOrNull !== null) {
            state.phase = FederatedVotingProtocolState_1.FederatedVotingPhase.accepted;
            state.accepted = statement;
            this.registerEvent(new VoteRatified_1.VoteRatified(state.node.publicKey, statement, quorumOrNull));
            this.registerEvent(new TransitionedToAcceptPhase_1.TransitionedToAcceptPhase(state.node.publicKey, state.phase, state.accepted));
            return true;
        }
        return false;
    }
    tryMoveToConfirmPhase(statement, state) {
        if (state.phase === FederatedVotingProtocolState_1.FederatedVotingPhase.confirmed) {
            return false;
        }
        const votesToAcceptStatement = this.filterVotesToAccept(state, statement);
        const quorumOrNull = this.isVoteRatified(state, votesToAcceptStatement);
        if (quorumOrNull !== null) {
            state.phase = FederatedVotingProtocolState_1.FederatedVotingPhase.confirmed;
            this.registerEvent(new AcceptVoteRatified_1.AcceptVoteRatified(state.node.publicKey, statement, quorumOrNull));
            this.registerEvent(new TransitionedToConfirmPhase_1.TransitionedToConfirmPhase(state.node.publicKey, state.phase, statement));
            return true;
        }
        return false;
    }
    areAcceptingNodesVBlocking(quorumSet, acceptVotes) {
        return QuorumSetService_1.QuorumSetService.isSetVBlocking(acceptVotes, quorumSet);
    }
    isVoteRatified(state, votes) {
        const quorumCandidate = new Map();
        votes.forEach((vote) => {
            quorumCandidate.set(vote.publicKey, vote.quorumSet);
        });
        const quorumOrNull = QuorumService_1.QuorumService.isQuorumContainingNode(state.node, quorumCandidate);
        return quorumOrNull;
    }
    filterVotesForStatement(state, statement) {
        return state.processedVotes.filter((v) => v.statement.toString() === statement.toString());
    }
    filterVotesToAccept(state, statement) {
        return state.processedVotes.filter((v) => v.statement.toString() === statement.toString() && v.isVoteToAccept);
    }
}
exports.PhaseTransitioner = PhaseTransitioner;
