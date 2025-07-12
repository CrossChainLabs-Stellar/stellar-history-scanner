"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnPeerData = void 0;
const observation_state_1 = require("../observation-state");
class OnPeerData {
    stellarMessageHandler;
    logger;
    connectionManager;
    constructor(stellarMessageHandler, logger, connectionManager) {
        this.stellarMessageHandler = stellarMessageHandler;
        this.logger = logger;
        this.connectionManager = connectionManager;
    }
    handle(data, observation) {
        const attemptLedgerClose = this.attemptLedgerClose(observation);
        const result = this.performWork(data, observation, attemptLedgerClose);
        if (result.isErr()) {
            this.disconnect(data, result.error);
            return this.returnEmpty();
        }
        return this.createOnPeerDataResult(result.value);
    }
    createOnPeerDataResult(result) {
        return {
            closedLedger: result.closedLedger,
            peers: result.peers
        };
    }
    performWork(data, observation, attemptLedgerClose) {
        const result = this.stellarMessageHandler.handleStellarMessage(data.publicKey, data.stellarMessageWork.stellarMessage, attemptLedgerClose, observation);
        data.stellarMessageWork.done();
        return result;
    }
    attemptLedgerClose(observation) {
        return observation.state === observation_state_1.ObservationState.Synced;
    }
    returnEmpty() {
        return {
            closedLedger: null,
            peers: []
        };
    }
    disconnect(data, error) {
        this.logger.info({ peer: data.publicKey }, error.message);
        this.connectionManager.disconnectByAddress(data.address, error);
    }
}
exports.OnPeerData = OnPeerData;
