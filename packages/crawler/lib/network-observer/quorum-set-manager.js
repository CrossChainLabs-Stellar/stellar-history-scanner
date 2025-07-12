"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuorumSetManager = void 0;
const stellar_base_1 = require("@stellar/stellar-base");
const neverthrow_1 = require("neverthrow");
const truncate_1 = require("../utilities/truncate");
/**
 * Fetches quorumSets in a sequential way from connected nodes.
 * Makes sure every peerNode that sent a scp message with a hash, gets the correct quorumSet.
 */
class QuorumSetManager {
    connectionManager;
    quorumRequestTimeoutMS;
    logger;
    constructor(connectionManager, quorumRequestTimeoutMS, logger) {
        this.connectionManager = connectionManager;
        this.quorumRequestTimeoutMS = quorumRequestTimeoutMS;
        this.logger = logger;
    }
    onNodeDisconnected(publicKey, observation) {
        if (!observation.quorumSetState.quorumSetRequests.has(publicKey))
            return;
        this.clearQuorumSetRequest(publicKey, observation);
    }
    processQuorumSetHashFromStatement(peer, scpStatement, observation) {
        const quorumSetHashResult = this.getQuorumSetHash(scpStatement);
        if (quorumSetHashResult.isErr())
            return;
        peer.quorumSetHash = quorumSetHashResult.value;
        if (!this.getQuorumSetHashOwners(peer.quorumSetHash, observation).has(peer.publicKey)) {
            this.logger.debug({ pk: peer.publicKey, hash: peer.quorumSetHash }, 'Detected quorumSetHash');
        }
        this.getQuorumSetHashOwners(peer.quorumSetHash, observation).add(peer.publicKey);
        if (observation.quorumSets.has(peer.quorumSetHash))
            peer.quorumSet = observation.quorumSets.get(peer.quorumSetHash);
        else {
            this.logger.debug({ pk: peer.publicKey }, 'Unknown quorumSet for hash: ' + peer.quorumSetHash);
            this.requestQuorumSet(peer.quorumSetHash, observation);
        }
    }
    processQuorumSet(quorumSetHash, quorumSet, sender, observation) {
        observation.quorumSets.set(quorumSetHash, quorumSet);
        const owners = this.getQuorumSetHashOwners(quorumSetHash, observation);
        owners.forEach((owner) => {
            const peer = observation.peerNodes.get(owner);
            if (peer)
                peer.quorumSet = quorumSet;
        });
        this.clearQuorumSetRequest(sender, observation);
    }
    peerNodeDoesNotHaveQuorumSet(peerPublicKey, quorumSetHash, observation) {
        const request = observation.quorumSetState.quorumSetRequests.get(peerPublicKey);
        if (!request)
            return;
        if (request.hash !== quorumSetHash)
            return;
        this.clearQuorumSetRequest(peerPublicKey, observation);
        this.requestQuorumSet(quorumSetHash, observation);
    }
    requestQuorumSet(quorumSetHash, observation) {
        if (observation.quorumSets.has(quorumSetHash))
            return;
        if (observation.quorumSetState.quorumSetHashesInProgress.has(quorumSetHash)) {
            this.logger.debug({ hash: quorumSetHash }, 'Request already in progress');
            return;
        }
        this.logger.debug({ hash: quorumSetHash }, 'Requesting quorumSet');
        const alreadyRequestedToResult = observation.quorumSetState.quorumSetRequestedTo.get(quorumSetHash);
        const alreadyRequestedTo = alreadyRequestedToResult
            ? alreadyRequestedToResult
            : new Set();
        observation.quorumSetState.quorumSetRequestedTo.set(quorumSetHash, alreadyRequestedTo);
        const owners = this.getQuorumSetHashOwners(quorumSetHash, observation);
        const quorumSetMessage = stellar_base_1.xdr.StellarMessage.getScpQuorumset(Buffer.from(quorumSetHash, 'base64'));
        const sendRequest = (to) => {
            const connection = this.connectionManager.getActiveConnection(to); //todo: need more separation
            if (!connection) {
                this.logger.warn({ hash: quorumSetHash, address: to }, 'No active connection to request quorumSet from');
                return;
            }
            alreadyRequestedTo.add(to);
            this.logger.info({ hash: quorumSetHash }, 'Requesting quorumSet from ' + to);
            connection.sendStellarMessage(quorumSetMessage);
            observation.quorumSetState.quorumSetHashesInProgress.add(quorumSetHash);
            observation.quorumSetState.quorumSetRequests.set(to, {
                hash: quorumSetHash,
                timeout: setTimeout(() => {
                    this.logger.info({ pk: (0, truncate_1.truncate)(to), hash: quorumSetHash }, 'Request timeout reached');
                    observation.quorumSetState.quorumSetRequests.delete(to);
                    observation.quorumSetState.quorumSetHashesInProgress.delete(quorumSetHash);
                    this.requestQuorumSet(quorumSetHash, observation);
                }, this.quorumRequestTimeoutMS)
            });
        };
        //first try the owners of the hashes
        const notYetRequestedOwnerWithActiveConnection = Array.from(owners.keys())
            .map((owner) => observation.peerNodes.get(owner))
            .filter((owner) => owner !== undefined)
            .filter((owner) => !alreadyRequestedTo.has(owner.key))
            .find((owner) => this.connectionManager.hasActiveConnectionTo(owner.key));
        if (notYetRequestedOwnerWithActiveConnection) {
            sendRequest(notYetRequestedOwnerWithActiveConnection.key);
            return;
        }
        //try other open connections
        const notYetRequestedNonOwnerActiveConnection = this.connectionManager
            .getActiveConnectionAddresses()
            .find((address) => !alreadyRequestedTo.has(address));
        if (notYetRequestedNonOwnerActiveConnection) {
            sendRequest(notYetRequestedNonOwnerActiveConnection);
            return;
        }
        this.logger.warn({ hash: quorumSetHash }, 'No active connections to request quorumSet from');
    }
    getQuorumSetHashOwners(quorumSetHash, observation) {
        let quorumSetHashOwners = observation.quorumSetState.quorumSetOwners.get(quorumSetHash);
        if (!quorumSetHashOwners) {
            quorumSetHashOwners = new Set();
            observation.quorumSetState.quorumSetOwners.set(quorumSetHash, quorumSetHashOwners);
        }
        return quorumSetHashOwners;
    }
    getQuorumSetHash(scpStatement) {
        try {
            let quorumSetHash;
            switch (scpStatement.pledges().switch()) {
                case stellar_base_1.xdr.ScpStatementType.scpStExternalize():
                    quorumSetHash = scpStatement
                        .pledges()
                        .externalize()
                        .commitQuorumSetHash()
                        .toString('base64');
                    break;
                case stellar_base_1.xdr.ScpStatementType.scpStConfirm():
                    quorumSetHash = scpStatement
                        .pledges()
                        .confirm()
                        .quorumSetHash()
                        .toString('base64');
                    break;
                case stellar_base_1.xdr.ScpStatementType.scpStPrepare():
                    quorumSetHash = scpStatement
                        .pledges()
                        .prepare()
                        .quorumSetHash()
                        .toString('base64');
                    break;
                case stellar_base_1.xdr.ScpStatementType.scpStNominate():
                    quorumSetHash = scpStatement
                        .pledges()
                        .nominate()
                        .quorumSetHash()
                        .toString('base64');
                    break;
            }
            if (quorumSetHash)
                return (0, neverthrow_1.ok)(quorumSetHash);
            else
                return (0, neverthrow_1.err)(new Error('Cannot parse quorumSet'));
        }
        catch (e) {
            if (e instanceof Error)
                return (0, neverthrow_1.err)(e);
            else
                return (0, neverthrow_1.err)(new Error('Cannot parse quorumSet'));
        }
    }
    clearQuorumSetRequest(peerPublicKey, observation) {
        const result = observation.quorumSetState.quorumSetRequests.get(peerPublicKey);
        if (!result)
            return;
        clearTimeout(result.timeout);
        observation.quorumSetState.quorumSetRequests.delete(peerPublicKey);
        observation.quorumSetState.quorumSetHashesInProgress.delete(result.hash);
    }
}
exports.QuorumSetManager = QuorumSetManager;
