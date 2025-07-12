"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkObserver = void 0;
const events_1 = require("events");
const assert_1 = __importDefault(require("assert"));
const observation_state_1 = require("./observation-state");
class NetworkObserver extends events_1.EventEmitter {
    observationFactory;
    connectionManager;
    quorumSetManager;
    peerEventHandler;
    observationManager;
    _observation = null;
    constructor(observationFactory, connectionManager, quorumSetManager, peerEventHandler, observationManager) {
        super();
        this.observationFactory = observationFactory;
        this.connectionManager = connectionManager;
        this.quorumSetManager = quorumSetManager;
        this.peerEventHandler = peerEventHandler;
        this.observationManager = observationManager;
        this.setupPeerEventHandlers();
    }
    async startObservation(observation) {
        this._observation = observation;
        await this.observationManager.startSync(this.observation);
        return this.connectionManager.getNumberOfActiveConnections();
    }
    connectToNode(ip, port) {
        (0, assert_1.default)(this.observation.state === observation_state_1.ObservationState.Synced);
        this.connectionManager.connectToNode(ip, port);
    }
    async stop() {
        return new Promise((resolve) => {
            this.observationManager.stopObservation(this.observation, () => this.onObservationStopped(resolve));
        });
    }
    onObservationStopped(resolve) {
        resolve(this.observation);
    }
    setupPeerEventHandlers() {
        this.connectionManager.on('connected', (data) => {
            this.peerEventHandler.onConnected(data, this.observation);
        });
        this.connectionManager.on('close', (data) => {
            this.peerEventHandler.onConnectionClose(data, this.observation);
            this.emit('disconnect', data);
        });
        this.connectionManager.on('data', (data) => {
            this.onPeerData(data);
        });
    }
    onPeerData(data) {
        const result = this.peerEventHandler.onData(data, this.observation);
        if (result.closedLedger) {
            this.observationManager.ledgerCloseConfirmed(this.observation, result.closedLedger);
        }
        if (result.peers.length > 0)
            this.emit('peers', result.peers);
    }
    get observation() {
        if (!this._observation) {
            throw new Error('Observation not set');
        }
        return this._observation;
    }
}
exports.NetworkObserver = NetworkObserver;
