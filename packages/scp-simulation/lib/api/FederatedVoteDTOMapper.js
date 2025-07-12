"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederatedVoteDTOMapper = void 0;
const StatementDTOMapper_1 = require("./StatementDTOMapper");
class FederatedVoteDTOMapper {
    static toDTO(federatedVotingState, includeQSet = false) {
        return {
            publicKey: federatedVotingState.node.publicKey,
            quorumSet: includeQSet ? federatedVotingState.node.quorumSet : undefined,
            confirmed: federatedVotingState.confirmed
                ? StatementDTOMapper_1.StatementDTOMapper.toStatementDTO(federatedVotingState.confirmed)
                : null,
            phase: federatedVotingState.phase,
            voted: federatedVotingState.voted
                ? StatementDTOMapper_1.StatementDTOMapper.toStatementDTO(federatedVotingState.voted)
                : null,
            accepted: federatedVotingState.accepted
                ? StatementDTOMapper_1.StatementDTOMapper.toStatementDTO(federatedVotingState.accepted)
                : null
        };
    }
}
exports.FederatedVoteDTOMapper = FederatedVoteDTOMapper;
