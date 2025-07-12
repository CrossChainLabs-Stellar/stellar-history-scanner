"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observation = void 0;
const assert_1 = __importDefault(require("assert"));
const observation_state_1 = require("./observation-state");
const quorum_set_state_1 = require("./quorum-set-state");
const lru_cache_1 = require("lru-cache");
class Observation {
    network;
    topTierAddresses;
    peerNodes;
    latestConfirmedClosedLedger;
    quorumSets;
    slots;
    state = observation_state_1.ObservationState.Idle;
    networkHalted = false;
    topTierAddressesSet;
    envelopeCache;
    quorumSetState = new quorum_set_state_1.QuorumSetState();
    constructor(network, topTierAddresses, peerNodes, latestConfirmedClosedLedger, quorumSets, slots) {
        this.network = network;
        this.topTierAddresses = topTierAddresses;
        this.peerNodes = peerNodes;
        this.latestConfirmedClosedLedger = latestConfirmedClosedLedger;
        this.quorumSets = quorumSets;
        this.slots = slots;
        this.topTierAddressesSet = this.mapTopTierAddresses(topTierAddresses);
        this.envelopeCache = new lru_cache_1.LRUCache({ max: 5000 });
    }
    mapTopTierAddresses(topTierNodes) {
        const topTierAddresses = new Set();
        topTierNodes.forEach((address) => {
            topTierAddresses.add(`${address[0]}:${address[1]}`);
        });
        return topTierAddresses;
    }
    moveToSyncingState() {
        (0, assert_1.default)(this.state === observation_state_1.ObservationState.Idle);
        this.state = observation_state_1.ObservationState.Syncing;
    }
    moveToSyncedState() {
        (0, assert_1.default)(this.state === observation_state_1.ObservationState.Syncing);
        this.state = observation_state_1.ObservationState.Synced;
    }
    moveToStoppingState() {
        (0, assert_1.default)(this.state !== observation_state_1.ObservationState.Idle);
        this.state = observation_state_1.ObservationState.Stopping;
    }
    moveToStoppedState() {
        (0, assert_1.default)(this.state === observation_state_1.ObservationState.Stopping);
        this.state = observation_state_1.ObservationState.Stopped;
    }
    ledgerCloseConfirmed(ledger) {
        this.networkHalted = false;
        if (this.state !== observation_state_1.ObservationState.Synced)
            return;
        this.latestConfirmedClosedLedger = ledger;
    }
    isNetworkHalted() {
        return this.networkHalted;
    }
    setNetworkHalted() {
        this.networkHalted = true;
    }
}
exports.Observation = Observation;
