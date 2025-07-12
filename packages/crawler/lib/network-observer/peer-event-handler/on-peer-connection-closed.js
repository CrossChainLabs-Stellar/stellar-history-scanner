"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnPeerConnectionClosed = void 0;
const truncate_1 = require("../../utilities/truncate");
class OnPeerConnectionClosed {
    quorumSetManager;
    logger;
    constructor(quorumSetManager, logger) {
        this.quorumSetManager = quorumSetManager;
        this.logger = logger;
    }
    handle(data, observation) {
        this.logIfTopTierDisconnect(data, observation.topTierAddressesSet);
        if (data.publicKey) {
            this.quorumSetManager.onNodeDisconnected(data.publicKey, observation);
        }
    }
    logIfTopTierDisconnect(data, topTierAddresses) {
        if (topTierAddresses.has(data.address)) {
            this.logger.debug({ pk: (0, truncate_1.truncate)(data.publicKey), address: data.address }, 'Top tier node disconnected');
        }
    }
}
exports.OnPeerConnectionClosed = OnPeerConnectionClosed;
