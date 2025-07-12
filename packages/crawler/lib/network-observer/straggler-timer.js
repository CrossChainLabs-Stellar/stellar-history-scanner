"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StragglerTimer = void 0;
class StragglerTimer {
    connectionManager;
    timers;
    straggleTimeoutMS;
    logger;
    constructor(connectionManager, timers, straggleTimeoutMS, logger) {
        this.connectionManager = connectionManager;
        this.timers = timers;
        this.straggleTimeoutMS = straggleTimeoutMS;
        this.logger = logger;
    }
    startStragglerTimeoutForActivePeers(includeTopTier = false, topTierAddresses, done) {
        const activePeers = this.connectionManager
            .getActiveConnectionAddresses()
            .filter((address) => {
            return includeTopTier || !topTierAddresses.has(address);
        });
        this.startStragglerTimeout(activePeers, done);
    }
    startStragglerTimeout(addresses, done) {
        if (addresses.length === 0)
            return;
        this.timers.startTimer(this.straggleTimeoutMS, () => {
            this.logger.debug({ addresses }, 'Straggler timeout hit');
            addresses.forEach((address) => {
                this.connectionManager.disconnectByAddress(address);
            });
            if (done)
                done();
        });
    }
    stopStragglerTimeouts() {
        this.timers.stopTimers();
    }
}
exports.StragglerTimer = StragglerTimer;
