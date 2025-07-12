"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservationManager = void 0;
class ObservationManager {
    connectionManager;
    consensusTimer;
    stragglerTimer;
    syncingTimeoutMS;
    logger;
    constructor(connectionManager, consensusTimer, stragglerTimer, syncingTimeoutMS, logger) {
        this.connectionManager = connectionManager;
        this.consensusTimer = consensusTimer;
        this.stragglerTimer = stragglerTimer;
        this.syncingTimeoutMS = syncingTimeoutMS;
        this.logger = logger;
    }
    async startSync(observation) {
        this.logger.info('Moving to syncing state');
        observation.moveToSyncingState();
        this.connectToTopTierNodes(observation.topTierAddresses);
        await this.timeout(this.syncingTimeoutMS);
        return this.syncCompleted(observation);
    }
    syncCompleted(observation) {
        this.logger.info({
            topTierConnections: this.connectionManager.getNumberOfActiveConnections()
        }, 'Moving to synced state');
        observation.moveToSyncedState();
        this.startNetworkConsensusTimer(observation);
    }
    ledgerCloseConfirmed(observation, ledger) {
        observation.ledgerCloseConfirmed(ledger);
        this.stragglerTimer.startStragglerTimeoutForActivePeers(false, observation.topTierAddressesSet);
        this.startNetworkConsensusTimer(observation);
    }
    startNetworkConsensusTimer(observation) {
        this.startNetworkConsensusTimerInternal(this.onNetworkHalted.bind(this, observation));
    }
    onNetworkHalted(observation) {
        this.logger.info('Network consensus timeout');
        observation.setNetworkHalted();
        this.stragglerTimer.startStragglerTimeoutForActivePeers(false, observation.topTierAddressesSet);
    }
    stopObservation(observation, onStoppedCallback) {
        this.logger.info('Moving to stopping state');
        observation.moveToStoppingState();
        this.consensusTimer.stop();
        if (this.connectionManager.getNumberOfActiveConnections() === 0) {
            return this.onLastNodesDisconnected(observation, onStoppedCallback);
        }
        this.stragglerTimer.startStragglerTimeoutForActivePeers(true, observation.topTierAddressesSet, () => this.onLastNodesDisconnected(observation, onStoppedCallback));
    }
    onLastNodesDisconnected(observation, onStopped) {
        this.logger.info('Moving to stopped state');
        observation.moveToStoppedState();
        this.stragglerTimer.stopStragglerTimeouts();
        this.connectionManager.shutdown();
        onStopped();
    }
    startNetworkConsensusTimerInternal(onNetworkHalted) {
        this.consensusTimer.start(onNetworkHalted);
    }
    connectToTopTierNodes(topTierNodes) {
        topTierNodes.forEach((address) => {
            this.connectionManager.connectToNode(address[0], address[1]);
        });
    }
    timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.ObservationManager = ObservationManager;
