"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScpStatementHandler = void 0;
const stellar_base_1 = require("@stellar/stellar-base");
const node_connector_1 = require("node-connector");
const neverthrow_1 = require("neverthrow");
const map_externalize_statement_1 = require("./externalize/map-externalize-statement");
class ScpStatementHandler {
    quorumSetManager;
    externalizeStatementHandler;
    logger;
    constructor(quorumSetManager, externalizeStatementHandler, logger) {
        this.quorumSetManager = quorumSetManager;
        this.externalizeStatementHandler = externalizeStatementHandler;
        this.logger = logger;
    }
    handle(scpStatement, observation) {
        const publicKeyResult = (0, node_connector_1.getPublicKeyStringFromBuffer)(scpStatement.nodeId().value());
        if (publicKeyResult.isErr()) {
            return (0, neverthrow_1.err)(publicKeyResult.error);
        }
        const publicKey = publicKeyResult.value;
        const slotIndex = BigInt(scpStatement.slotIndex().toString());
        this.logger.debug({
            publicKey: publicKey,
            slotIndex: slotIndex.toString()
        }, 'processing new scp statement: ' + scpStatement.pledges().switch().name);
        const peer = observation.peerNodes.getOrAdd(publicKey); //maybe we got a relayed message from a peer that we have not crawled yet
        peer.participatingInSCP = true;
        peer.latestActiveSlotIndex = slotIndex.toString();
        this.quorumSetManager.processQuorumSetHashFromStatement(peer, scpStatement, observation);
        if (scpStatement.pledges().switch().value !==
            stellar_base_1.xdr.ScpStatementType.scpStExternalize().value) {
            //only if node is externalizing, we mark the node as validating
            return (0, neverthrow_1.ok)({
                closedLedger: null
            });
        }
        const externalizeData = (0, map_externalize_statement_1.mapExternalizeStatement)(scpStatement);
        if (!externalizeData.isOk()) {
            return (0, neverthrow_1.err)(externalizeData.error);
        }
        const closedLedgerOrNull = this.externalizeStatementHandler.handle(observation.peerNodes, observation.slots.getSlot(slotIndex), externalizeData.value, new Date(), //todo: move up,
        observation.latestConfirmedClosedLedger);
        if (closedLedgerOrNull !== null &&
            closedLedgerOrNull.sequence >
                observation.latestConfirmedClosedLedger.sequence) {
            return (0, neverthrow_1.ok)({
                closedLedger: closedLedgerOrNull
            });
        }
        return (0, neverthrow_1.ok)({
            closedLedger: null
        });
    }
}
exports.ScpStatementHandler = ScpStatementHandler;
