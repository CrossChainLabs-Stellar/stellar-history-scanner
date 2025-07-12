"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
const net = __importStar(require("net"));
const connection_1 = require("./connection/connection");
const events_1 = require("events");
const net_1 = require("net");
const flow_controller_1 = require("./connection/flow-controller");
/**
 * Supports two operations: connect to a node, and accept connections from other nodes.
 * In both cases it returns Connection instances that produce and consume StellarMessages
 */
class Node extends events_1.EventEmitter {
    config;
    keyPair;
    connectionAuthentication;
    logger;
    server;
    constructor(config, keyPair, connectionAuthentication, logger) {
        super();
        this.config = config;
        this.keyPair = keyPair;
        this.connectionAuthentication = connectionAuthentication;
        this.logger = logger;
        this.logger.info('Using public key: ' + this.keyPair.publicKey());
    }
    /*
     * Connect to a node
     */
    connectTo(ip, port) {
        const socket = new net.Socket();
        const flowController = new flow_controller_1.FlowController(this.config.peerFloodReadingCapacity, this.config.flowControlSendMoreBatchSize, this.config.peerFloodReadingCapacityBytes, this.config.flowControlSendMoreBatchSizeBytes);
        const connection = new connection_1.Connection({
            ip: ip,
            port: port,
            keyPair: this.keyPair,
            localNodeInfo: {
                ledgerVersion: this.config.nodeInfo.ledgerVersion,
                overlayVersion: this.config.nodeInfo.overlayVersion,
                overlayMinVersion: this.config.nodeInfo.overlayMinVersion,
                versionString: this.config.nodeInfo.versionString
            },
            listeningPort: this.config.listeningPort,
            remoteCalledUs: false,
            receiveTransactionMessages: this.config.receiveTransactionMessages,
            receiveSCPMessages: this.config.receiveSCPMessages
        }, socket, this.connectionAuthentication, flowController, this.logger);
        this.logger.debug({ remote: connection.remoteAddress }, 'Connect');
        connection.connect();
        return connection;
    }
    /*
     * Start accepting connections from other nodes.
     * emits connection event with a Connection instance on a new incoming connection
     */
    acceptIncomingConnections(port, host) {
        if (!this.server) {
            this.server = new net_1.Server();
            this.server.on('connection', (socket) => this.onIncomingConnection(socket));
            this.server.on('error', (err) => this.emit('error', err));
            this.server.on('close', () => this.emit('close'));
            this.server.on('listening', () => this.emit('listening'));
        }
        if (!this.server.listening)
            this.server.listen(port, host);
    }
    stopAcceptingIncomingConnections(callback) {
        if (this.server)
            this.server.close(callback);
        else if (callback)
            callback();
    }
    get listening() {
        if (this.server)
            return this.server.listening;
        else
            return false;
    }
    onIncomingConnection(socket) {
        if (socket.remoteAddress === undefined || socket.remotePort === undefined)
            return; //this can happen when socket is immediately destroyed
        const flowController = new flow_controller_1.FlowController(this.config.peerFloodReadingCapacity, this.config.flowControlSendMoreBatchSize, this.config.peerFloodReadingCapacityBytes, this.config.flowControlSendMoreBatchSizeBytes);
        const connection = new connection_1.Connection({
            ip: socket.remoteAddress,
            port: socket.remotePort,
            keyPair: this.keyPair,
            localNodeInfo: {
                ledgerVersion: this.config.nodeInfo.ledgerVersion,
                overlayVersion: this.config.nodeInfo.overlayVersion,
                overlayMinVersion: this.config.nodeInfo.overlayMinVersion,
                versionString: this.config.nodeInfo.versionString
            },
            listeningPort: this.config.listeningPort,
            remoteCalledUs: true,
            receiveTransactionMessages: this.config.receiveTransactionMessages,
            receiveSCPMessages: this.config.receiveSCPMessages
        }, socket, this.connectionAuthentication, flowController, this.logger);
        this.emit('connection', connection);
    }
}
exports.Node = Node;
