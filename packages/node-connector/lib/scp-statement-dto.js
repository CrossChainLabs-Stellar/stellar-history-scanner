"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCPStatement = void 0;
const stellar_base_1 = require("@stellar/stellar-base");
const neverthrow_1 = require("neverthrow");
class SCPStatement {
    nodeId;
    slotIndex;
    type;
    pledges;
    constructor(nodeId, slotIndex, type, pledges) {
        this.nodeId = nodeId;
        this.slotIndex = slotIndex;
        this.type = type;
        this.pledges = pledges;
    }
    static fromXdr(xdrInput) {
        if (typeof xdrInput === 'string') {
            const buffer = Buffer.from(xdrInput, 'base64');
            xdrInput = stellar_base_1.xdr.ScpStatement.fromXDR(buffer);
        }
        const nodeId = stellar_base_1.StrKey.encodeEd25519PublicKey(xdrInput.nodeId().value()).toString(); //slow! cache!
        const slotIndex = xdrInput.slotIndex().toString();
        const xdrType = xdrInput.pledges().switch();
        let pledges;
        let type;
        if (xdrType === stellar_base_1.xdr.ScpStatementType.scpStExternalize()) {
            type = 'externalize';
            const statement = xdrInput
                .pledges()
                .value();
            pledges = {
                quorumSetHash: statement.commitQuorumSetHash().toString('base64'),
                nH: statement.nH(),
                commit: {
                    counter: statement.commit().counter(),
                    value: statement.commit().value().toString('base64')
                }
            };
        }
        else if (xdrType === stellar_base_1.xdr.ScpStatementType.scpStConfirm()) {
            const statement = xdrInput.pledges().value();
            type = 'confirm';
            pledges = {
                quorumSetHash: statement.quorumSetHash().toString('base64'),
                nH: statement.nH(),
                nPrepared: statement.nPrepared(),
                nCommit: statement.nCommit(),
                ballot: {
                    counter: statement.ballot().counter(),
                    value: statement.ballot().value().toString('base64')
                }
            };
        }
        else if (xdrType === stellar_base_1.xdr.ScpStatementType.scpStNominate()) {
            const statement = xdrInput.pledges().value();
            type = 'nominate';
            pledges = {
                quorumSetHash: statement.quorumSetHash().toString('base64'),
                votes: statement.votes().map((vote) => vote.toString('base64')),
                accepted: statement
                    .votes()
                    .map((vote) => vote.toString('base64'))
            };
        }
        else if (xdrType === stellar_base_1.xdr.ScpStatementType.scpStPrepare()) {
            type = 'prepare';
            const statement = xdrInput.pledges().value();
            const prepared = statement.prepared();
            const preparedPrime = statement.preparedPrime();
            pledges = {
                quorumSetHash: statement.quorumSetHash().toString('base64'),
                ballot: {
                    counter: statement.ballot().counter(),
                    value: statement.ballot().value().toString('base64')
                },
                prepared: prepared
                    ? {
                        counter: prepared.counter(),
                        value: prepared.value().toString('base64')
                    }
                    : null,
                preparedPrime: preparedPrime
                    ? {
                        counter: preparedPrime.counter(),
                        value: preparedPrime.value().toString('base64')
                    }
                    : null,
                nC: statement.nH(),
                nH: statement.nC()
            };
        }
        else {
            return (0, neverthrow_1.err)(new Error('unknown type: ' + xdrType));
        }
        return (0, neverthrow_1.ok)(new SCPStatement(nodeId, slotIndex, type, pledges));
    }
}
exports.SCPStatement = SCPStatement;
