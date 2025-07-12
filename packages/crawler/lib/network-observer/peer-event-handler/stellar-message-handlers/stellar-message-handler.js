"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarMessageHandler = void 0;
const node_connector_1 = require("node-connector");
const stellar_base_1 = require("@stellar/stellar-base");
const truncate_1 = require("../../../utilities/truncate");
const shared_1 = require("shared");
const neverthrow_1 = require("neverthrow");
class StellarMessageHandler {
    scpEnvelopeHandler;
    quorumSetManager;
    logger;
    constructor(scpEnvelopeHandler, quorumSetManager, logger) {
        this.scpEnvelopeHandler = scpEnvelopeHandler;
        this.quorumSetManager = quorumSetManager;
        this.logger = logger;
    }
    handleStellarMessage(sender, stellarMessage, attemptLedgerClose, observation) {
        switch (stellarMessage.switch()) {
            case stellar_base_1.xdr.MessageType.scpMessage(): {
                if (!attemptLedgerClose)
                    return (0, neverthrow_1.ok)({
                        closedLedger: null,
                        peers: []
                    });
                const result = this.scpEnvelopeHandler.handle(stellarMessage.envelope(), observation);
                if (result.isErr()) {
                    return (0, neverthrow_1.err)(result.error);
                }
                return (0, neverthrow_1.ok)({
                    closedLedger: result.value.closedLedger,
                    peers: []
                });
            }
            case stellar_base_1.xdr.MessageType.peers(): {
                const result = this.handlePeersMessage(sender, stellarMessage.peers(), observation.peerNodes);
                if (result.isErr()) {
                    return (0, neverthrow_1.err)(result.error);
                }
                return (0, neverthrow_1.ok)({
                    closedLedger: null,
                    peers: result.value.peers
                });
            }
            case stellar_base_1.xdr.MessageType.scpQuorumset(): {
                const result = this.handleScpQuorumSetMessage(sender, stellarMessage.qSet(), observation);
                if (result.isErr()) {
                    return (0, neverthrow_1.err)(result.error);
                }
                return (0, neverthrow_1.ok)({
                    closedLedger: null,
                    peers: []
                });
            }
            case stellar_base_1.xdr.MessageType.dontHave(): {
                const result = this.handleDontHaveMessage(sender, stellarMessage.dontHave(), observation);
                if (result.isErr()) {
                    return (0, neverthrow_1.err)(result.error);
                }
                return (0, neverthrow_1.ok)({
                    closedLedger: null,
                    peers: []
                });
            }
            case stellar_base_1.xdr.MessageType.errorMsg(): {
                const result = this.handleErrorMsg(sender, stellarMessage.error(), observation);
                if (result.isErr()) {
                    return (0, neverthrow_1.err)(result.error);
                }
                return (0, neverthrow_1.ok)({
                    closedLedger: null,
                    peers: []
                });
            }
            default:
                this.logger.debug({ type: stellarMessage.switch().name }, 'Unhandled Stellar message type');
                return (0, neverthrow_1.ok)({
                    closedLedger: null,
                    peers: []
                });
        }
    }
    handlePeersMessage(sender, peers, peerNodeCollection) {
        const peerAddresses = [];
        peers.forEach((peer) => {
            const ipResult = (0, node_connector_1.getIpFromPeerAddress)(peer);
            if (ipResult.isOk())
                peerAddresses.push([ipResult.value, peer.port()]);
        });
        peerNodeCollection.setPeerSuppliedPeerList(sender, true);
        this.logger.debug({ peer: sender }, peerAddresses.length + ' peers received');
        return (0, neverthrow_1.ok)({
            peers: peerAddresses
        });
    }
    handleScpQuorumSetMessage(sender, quorumSetMessage, observation) {
        const quorumSetHash = (0, stellar_base_1.hash)(quorumSetMessage.toXDR()).toString('base64');
        const quorumSetResult = (0, node_connector_1.getQuorumSetFromMessage)(quorumSetMessage);
        if (quorumSetResult.isErr()) {
            return (0, neverthrow_1.err)(quorumSetResult.error);
        }
        this.logger.info({
            pk: (0, truncate_1.truncate)(sender),
            hash: quorumSetHash
        }, 'QuorumSet received');
        this.quorumSetManager.processQuorumSet(quorumSetHash, shared_1.QuorumSet.fromBaseQuorumSet(quorumSetResult.value), sender, observation);
        return (0, neverthrow_1.ok)(undefined);
    }
    handleDontHaveMessage(sender, dontHave, observation) {
        this.logger.info({
            pk: (0, truncate_1.truncate)(sender),
            type: dontHave.type().name
        }, "Don't have");
        if (dontHave.type().value === stellar_base_1.xdr.MessageType.getScpQuorumset().value) {
            this.logger.info({
                pk: (0, truncate_1.truncate)(sender),
                hash: dontHave.reqHash().toString('base64')
            }, "Don't have");
            this.quorumSetManager.peerNodeDoesNotHaveQuorumSet(sender, dontHave.reqHash().toString('base64'), observation);
        }
        return (0, neverthrow_1.ok)(undefined);
    }
    handleErrorMsg(sender, error, observation) {
        switch (error.code()) {
            case stellar_base_1.xdr.ErrorCode.errLoad():
                return this.onLoadTooHighReceived(sender, observation);
            default:
                this.logger.info({
                    pk: (0, truncate_1.truncate)(sender),
                    error: error.code().name
                }, error.msg().toString());
                return (0, neverthrow_1.ok)(undefined);
        }
    }
    onLoadTooHighReceived(sender, observation) {
        this.logger.debug({ peer: sender }, 'Load too high message received');
        observation.peerNodes.setPeerOverloaded(sender, true);
        return (0, neverthrow_1.ok)(undefined);
    }
}
exports.StellarMessageHandler = StellarMessageHandler;
