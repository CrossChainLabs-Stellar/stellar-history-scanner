"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionManager = void 0;
const events_1 = require("events");
const truncate_1 = require("../utilities/truncate");
class ConnectionManager extends events_1.EventEmitter {
    node;
    blackList;
    logger;
    activeConnections;
    constructor(node, blackList, logger) {
        super();
        this.node = node;
        this.blackList = blackList;
        this.logger = logger;
        this.activeConnections = new Map(); // Active connections keyed by node public key or address
    }
    /**
     * Connects to a node at the specified IP and port.
     * @param {string} ip The IP address of the node.
     * @param {number} port The port number of the node.
     */
    connectToNode(ip, port) {
        const address = `${ip}:${port}`;
        const connection = this.node.connectTo(ip, port);
        this.logger.debug({ peer: connection.remoteAddress }, 'Connecting');
        // Setup event listeners for the connection
        connection.on('connect', (publicKey, nodeInfo) => {
            this.logger.trace('Connect event received');
            if (this.blackList.has(publicKey)) {
                this.logger.debug({ peer: connection.remoteAddress }, 'Blacklisted');
                this.disconnect(connection);
                return;
            }
            this.logger.debug({
                pk: (0, truncate_1.truncate)(publicKey),
                peer: connection.remoteAddress,
                local: connection.localAddress
            }, 'Connected');
            this.activeConnections.set(address, connection);
            connection.remotePublicKey = publicKey;
            this.emit('connected', { publicKey, ip, port, nodeInfo });
        });
        connection.on('error', (error) => {
            this.logger.debug(`Connection error with ${address}: ${error.message}`);
            this.disconnect(connection, error);
        });
        connection.on('timeout', () => {
            this.logger.debug(`Connection timeout for ${address}`);
            this.disconnect(connection);
        });
        connection.on('close', (hadError) => {
            this.logger.debug({
                pk: (0, truncate_1.truncate)(connection.remotePublicKey),
                peer: connection.remoteAddress,
                hadError: hadError,
                local: connection.localAddress
            }, 'Node connection closed');
            this.activeConnections.delete(address);
            const closePayload = {
                address,
                publicKey: connection.remotePublicKey
            };
            this.emit('close', closePayload);
        });
        connection.on('data', (stellarMessageWork) => {
            if (!connection.remotePublicKey) {
                this.logger.error(`Received data from unknown peer ${address}`);
                return;
            }
            this.emit('data', {
                address,
                publicKey: connection.remotePublicKey,
                stellarMessageWork
            });
        });
    }
    disconnect(connection, error) {
        if (error) {
            this.logger.debug({
                peer: connection.remoteAddress,
                pk: (0, truncate_1.truncate)(connection.remotePublicKey),
                error: error.message
            }, 'Disconnecting');
        }
        else {
            this.logger.trace({
                peer: connection.remoteAddress,
                pk: (0, truncate_1.truncate)(connection.remotePublicKey)
            }, 'Disconnecting');
        }
        connection.destroy();
    }
    /*public broadcast(stellarMessage: xdr.StellarMessage, doNotSendTo: Set<Address>) {

    }*/
    disconnectByAddress(address, error) {
        const connection = this.activeConnections.get(address);
        if (!connection) {
            return;
        }
        this.disconnect(connection, error);
    }
    getActiveConnection(address) {
        return this.activeConnections.get(address);
    }
    getActiveConnectionAddresses() {
        return Array.from(this.activeConnections.keys());
    }
    hasActiveConnectionTo(address) {
        return this.activeConnections.has(address);
    }
    getNumberOfActiveConnections() {
        return this.activeConnections.size;
    }
    /**
     * Shuts down the connection manager, closing all active connections.
     */
    shutdown() {
        this.activeConnections.forEach((connection) => {
            this.disconnect(connection);
        }); //what about the in progress connections
        this.logger.info('ConnectionManager shutdown: All connections closed.', {
            activeConnections: this.activeConnections.size
        });
    }
}
exports.ConnectionManager = ConnectionManager;
