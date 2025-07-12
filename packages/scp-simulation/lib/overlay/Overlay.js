"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Overlay = void 0;
const core_1 = require("../core");
const federated_voting_1 = require("../federated-voting");
const ReceiveMessage_1 = require("../federated-voting/action/protocol/ReceiveMessage");
const Gossip_1 = require("./action/Gossip");
const BroadcastDisrupted_1 = require("./event/BroadcastDisrupted");
const BroadcastFailed_1 = require("./event/BroadcastFailed");
const ConnectionAdded_1 = require("./event/ConnectionAdded");
const ConnectionRemoved_1 = require("./event/ConnectionRemoved");
const GossipDisrupted_1 = require("./event/GossipDisrupted");
const ReceiveMessageDisrupted_1 = require("./event/ReceiveMessageDisrupted");
class Overlay extends core_1.InMemoryEventCollector {
    nodes = new Set();
    connections = new Map();
    _fullyConnected = false;
    _gossipEnabled = false;
    constructor(fullyConnected = true, gossipEnabled = false) {
        super();
        this._fullyConnected = fullyConnected;
        this._gossipEnabled = gossipEnabled;
    }
    //Track sent and received payloads(e.g. votes) for every node
    exchanges = new Set();
    getExchangeKey(sender, receiver, payload) {
        const [first, second] = [sender, receiver].sort();
        return `${first}-${payload.hash()}-${second}`;
    }
    markExchanged(message) {
        this.exchanges.add(this.getExchangeKey(message.sender, message.receiver, message.vote));
    }
    hasExchangedPayload(sender, receiver, payload) {
        return this.exchanges.has(this.getExchangeKey(sender, receiver, payload));
    }
    removeExchanges(node) {
        this.exchanges = new Set([...this.exchanges].filter((key) => !key.startsWith(`${node}-`) && !key.endsWith(`-${node}`)));
    }
    get fullyConnected() {
        return this._fullyConnected;
    }
    get gossipEnabled() {
        return this._gossipEnabled;
    }
    reset() {
        this.nodes = new Set();
        this.connections = new Map();
        this.exchanges = new Set();
    }
    addNode(node) {
        this.nodes.add(node);
        if (!this.connections.has(node)) {
            this.connections.set(node, new Set());
        }
        if (this.fullyConnected)
            this.makeFullyConnected();
    }
    removeNode(node) {
        this.nodes.delete(node);
        this.connections.delete(node);
        // Remove connections to this node from all other nodes
        for (const [, neighbors] of this.connections) {
            neighbors.delete(node);
        }
        this.removeExchanges(node);
    }
    addConnection(a, b) {
        if (!this.nodes.has(a) || !this.nodes.has(b)) {
            console.log('Nodes in connection not found', a, b);
            return;
        }
        // Create node entries in connections map if they don't exist
        if (!this.connections.has(a))
            this.connections.set(a, new Set());
        if (!this.connections.has(b))
            this.connections.set(b, new Set());
        // Add bidirectional connection
        this.connections.get(a).add(b);
        this.connections.get(b).add(a);
        if (!this.fullyConnected)
            this.registerEvent(new ConnectionAdded_1.ConnectionAdded(a, b));
    }
    removeConnection(a, b) {
        const aConnectectToB = this.connections.get(a)?.has(b);
        const bConnectectToA = this.connections.get(b)?.has(a);
        if (aConnectectToB || bConnectectToA) {
            this.registerEvent(new ConnectionRemoved_1.ConnectionRemoved(a, b));
            this.connections.get(a)?.delete(b);
            this.connections.get(b)?.delete(a);
        }
    }
    broadcast(broadcaster, payload, neighborBlackList = []) {
        const actions = [];
        for (const node of this.connections.get(broadcaster) || []) {
            if (node === broadcaster) {
                continue;
            }
            if (neighborBlackList.includes(node)) {
                this.registerEvent(new BroadcastDisrupted_1.BroadcastDisrupted(broadcaster, node, payload));
                continue;
            }
            const message = new federated_voting_1.Message(broadcaster, node, payload);
            actions.push(new ReceiveMessage_1.ReceiveMessage(message));
            this.markSent(message);
        }
        if (actions.length === 0 && neighborBlackList.length === 0) {
            //indicate that there were no overlay connections
            this.registerEvent(new BroadcastFailed_1.BroadcastFailed(broadcaster, payload));
        }
        return actions;
    }
    receiveMessage(message, isDisrupted) {
        if (isDisrupted) {
            this.registerEvent(new ReceiveMessageDisrupted_1.ReceiveMessageDisrupted(message.receiver, message.sender, message.vote));
            return [];
        }
        this.markReceived(message);
        const results = [];
        // If gossip is enabled, check if we need to gossip to neighbors
        if (this.gossipEnabled &&
            !this.hasSentToAllNeighbors(message.receiver, message.vote)) {
            results.push(new Gossip_1.Gossip(message.receiver, message.vote));
        }
        return results;
    }
    gossip(sender, payload, neighborBlackList) {
        const actions = [];
        const neighbors = this.connections.get(sender) || new Set();
        for (const neighbor of neighbors) {
            if (!this.hasExchangedPayload(sender, neighbor, payload)) {
                if (neighborBlackList.includes(neighbor)) {
                    this.registerEvent(new GossipDisrupted_1.GossipDisrupted(sender, neighbor, payload));
                    continue;
                }
                const newMessage = new federated_voting_1.Message(sender, neighbor, payload);
                actions.push(this.sendMessage(newMessage));
            }
        }
        return actions;
    }
    sendMessage(message, isForged = false) {
        this.markSent(message, isForged);
        return new ReceiveMessage_1.ReceiveMessage(message);
    }
    makeFullyConnected() {
        for (const n1 of this.nodes) {
            for (const n2 of this.nodes) {
                if (n1 !== n2) {
                    this.addConnection(n1, n2);
                }
            }
        }
    }
    markSent(message, isForged = false) {
        if (!isForged)
            this.registerEvent(new federated_voting_1.MessageSent(message));
        else
            this.registerEvent(new federated_voting_1.ForgedMessageSent(message));
        this.markExchanged(message);
    }
    markReceived(message) {
        this.registerEvent(new federated_voting_1.MessageReceived(message));
        this.markExchanged(message);
    }
    hasSentToAllNeighbors(node, payload) {
        const neighbors = this.connections.get(node) || new Set();
        for (const neighbor of neighbors) {
            if (!this.hasExchangedPayload(node, neighbor, payload)) {
                return false;
            }
        }
        return true;
    }
}
exports.Overlay = Overlay;
