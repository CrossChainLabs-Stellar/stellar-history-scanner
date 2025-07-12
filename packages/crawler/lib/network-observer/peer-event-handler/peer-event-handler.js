"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeerEventHandler = void 0;
class PeerEventHandler {
    onConnectedHandler;
    onConnectionCloseHandler;
    onPeerDataHandler;
    constructor(onConnectedHandler, onConnectionCloseHandler, onPeerDataHandler) {
        this.onConnectedHandler = onConnectedHandler;
        this.onConnectionCloseHandler = onConnectionCloseHandler;
        this.onPeerDataHandler = onPeerDataHandler;
    }
    onConnected(data, observation) {
        this.onConnectedHandler.handle(data, observation);
    }
    onConnectionClose(data, observation) {
        this.onConnectionCloseHandler.handle(data, observation);
    }
    onData(data, observation) {
        return this.onPeerDataHandler.handle(data, observation);
    }
}
exports.PeerEventHandler = PeerEventHandler;
