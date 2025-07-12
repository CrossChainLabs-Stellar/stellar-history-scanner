"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnPeerConnected = void 0;
const truncate_1 = require("../../utilities/truncate");
const observation_state_1 = require("../observation-state");
class OnPeerConnected {
    stragglerHandler;
    connectionManager;
    logger;
    constructor(stragglerHandler, connectionManager, logger) {
        this.stragglerHandler = stragglerHandler;
        this.connectionManager = connectionManager;
        this.logger = logger;
    }
    handle(data, observation) {
        this.logIfTopTierConnected(data, observation);
        const peerNodeOrError = this.addPeerNode(data, observation.peerNodes);
        if (peerNodeOrError instanceof Error) {
            this.disconnect(data.ip, data.port, peerNodeOrError);
            return peerNodeOrError;
        }
        if (observation.isNetworkHalted()) {
            return this.collectMinimalDataAndDisconnect(data);
        }
        this.handleConnectedByState(observation, data);
    }
    handleConnectedByState(observation, data) {
        switch (observation.state) {
            case observation_state_1.ObservationState.Idle:
                return this.disconnectBecauseIdle(data);
            case observation_state_1.ObservationState.Stopping:
                return this.collectMinimalDataAndDisconnect(data);
            default:
                return;
        }
    }
    disconnectBecauseIdle(data) {
        return this.disconnect(data.ip, data.port, this.createIdleConnectedError());
    }
    createIdleConnectedError() {
        return new Error('Connected while idle');
    }
    collectMinimalDataAndDisconnect(data) {
        return this.startStragglerTimeout(data);
    }
    startStragglerTimeout(data) {
        return this.stragglerHandler.startStragglerTimeout([
            data.ip + ':' + data.port
        ]);
    }
    disconnect(ip, port, error) {
        this.connectionManager.disconnectByAddress(`${ip}:${port}`, error);
    }
    addPeerNode(data, peerNodes) {
        return peerNodes.addSuccessfullyConnected(data.publicKey, data.ip, data.port, data.nodeInfo);
    }
    logIfTopTierConnected(data, observation) {
        if (observation.topTierAddressesSet.has(`${data.ip}:${data.port}`)) {
            this.logger.debug({ pk: (0, truncate_1.truncate)(data.publicKey) }, 'Top tier node connected');
        }
    }
}
exports.OnPeerConnected = OnPeerConnected;
