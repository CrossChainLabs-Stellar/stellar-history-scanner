"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederatedVotingContext = void 0;
const core_1 = require("../core");
const FederatedVotingProtocolState_1 = require("./protocol/FederatedVotingProtocolState");
const BroadcastVoteRequested_1 = require("./protocol/event/BroadcastVoteRequested");
const NodeUpdatedQuorumSet_1 = require("./protocol/event/NodeUpdatedQuorumSet");
const Broadcast_1 = require("./action/protocol/Broadcast");
class FederatedVotingContext extends core_1.InMemoryEventCollector //todo: composition
 {
    federatedVotingProtocol;
    overlay;
    state = {
        protocolStates: [],
        safetyDisruptingNodes: new Set(),
        livenessDisruptingNodes: new Set()
    };
    constructor(federatedVotingProtocol, overlay) {
        super();
        this.federatedVotingProtocol = federatedVotingProtocol;
        this.overlay = overlay;
    }
    reset() {
        this.state.protocolStates = [];
        this.state.livenessDisruptingNodes.clear();
        this.state.safetyDisruptingNodes.clear();
        this.overlay.reset();
        this.drainEvents(); // Clear the collected events
    }
    //for exposing the state in GUI. Should not be altered directly
    getState() {
        return this.state;
    }
    //userActions are always executed first
    executeActions(protocolActions, userActions) {
        const newProtocolActions = [];
        //sort userActions such that userActions with boolean immediateExecution set to true runs first
        //order of immediateExecution should be preserved
        userActions.sort((a, b) => {
            if (a.immediateExecution && !b.immediateExecution) {
                return -1;
            }
            if (!a.immediateExecution && b.immediateExecution) {
                return 1;
            }
            return 0;
        });
        userActions.forEach((action) => {
            newProtocolActions.push(...action.execute(this));
        });
        protocolActions.forEach((action) => {
            newProtocolActions.push(...action.execute(this));
        });
        return newProtocolActions;
    }
    addNode(node) {
        if (this.getProtocolState(node.publicKey)) {
            return [];
        }
        this.state.protocolStates.push(new FederatedVotingProtocolState_1.FederatedVotingProtocolState(node));
        this.overlay.addNode(node.publicKey);
        //todo: Events?
        return [];
    }
    addConnection(a, b) {
        this.overlay.addConnection(a, b);
        this.registerEvents(this.overlay.drainEvents());
        return [];
    }
    removeConnection(a, b) {
        this.overlay.removeConnection(a, b);
        this.registerEvents(this.overlay.drainEvents());
        return [];
    }
    removeNode(publicKey) {
        const index = this.state.protocolStates.findIndex((state) => state.node.publicKey === publicKey);
        if (index === -1) {
            console.log('Node not found');
            return [];
        }
        this.state.protocolStates.splice(index, 1);
        this.overlay.removeNode(publicKey);
        //todo: Events?
        return [];
    }
    updateQuorumSet(publicKey, quorumSet) {
        const node = this.state.protocolStates
            .map((state) => state.node)
            .find((node) => node.publicKey === publicKey);
        if (!node) {
            console.log('Node not found', publicKey);
            return [];
        }
        node.updateQuorumSet(quorumSet);
        this.registerEvent(new NodeUpdatedQuorumSet_1.NodeUpdatedQuorumSet(publicKey, quorumSet));
        return [];
    }
    getProtocolState(publicKey) {
        const state = this.state.protocolStates.find((state) => state.node.publicKey === publicKey);
        return state ? state : null;
    }
    vote(publicKey, statement) {
        if (!this.canVote(publicKey)) {
            console.log('Node cannot vote');
            return [];
        }
        const nodeFederatedVotingState = this.state.protocolStates.find((state) => state.node.publicKey === publicKey);
        if (!nodeFederatedVotingState) {
            console.log('Node not found');
            return [];
        }
        this.federatedVotingProtocol.vote(statement, nodeFederatedVotingState);
        const events = this.federatedVotingProtocol.drainEvents();
        this.registerEvents(events);
        return this.processVoteBroadcastRequests(events);
    }
    processVoteBroadcastRequests(events) {
        const protocolActions = [];
        events
            .filter((event) => event instanceof BroadcastVoteRequested_1.BroadcastVoteRequested)
            .forEach((event) => {
            const broadcastVoteRequested = event;
            protocolActions.push(new Broadcast_1.Broadcast(broadcastVoteRequested.publicKey, broadcastVoteRequested.vote));
        });
        return protocolActions;
    }
    canVote(publicKey) {
        const nodeFederatedVotingState = this.state.protocolStates.find((state) => state.node.publicKey === publicKey);
        if (!nodeFederatedVotingState) {
            console.log('Node not found');
            return false;
        }
        return nodeFederatedVotingState.voted === null; //todo also check if there is a command!
    }
    forgeMessage(message) {
        this.state.safetyDisruptingNodes.add(message.sender);
        this.state.livenessDisruptingNodes.add(message.sender);
        const action = this.overlay.sendMessage(message, true);
        this.registerEvents(this.overlay.drainEvents());
        return [action];
    }
    broadcast(broadcaster, payload, neighborBlackList) {
        if (neighborBlackList.length > 0) {
            this.state.livenessDisruptingNodes.add(broadcaster);
        }
        const actions = this.overlay.broadcast(broadcaster, payload, neighborBlackList);
        this.registerEvents(this.overlay.drainEvents());
        return actions;
    }
    gossip(gossiper, payload, neighborBlackList) {
        if (neighborBlackList.length > 0) {
            this.state.livenessDisruptingNodes.add(gossiper);
        }
        const actions = this.overlay.gossip(gossiper, payload, neighborBlackList);
        this.registerEvents(this.overlay.drainEvents());
        return actions;
    }
    receiveMessage(message, isDisrupted) {
        if (isDisrupted) {
            this.state.livenessDisruptingNodes.add(message.receiver);
        }
        const nodeFederatedVotingState = this.getProtocolState(message.receiver);
        if (!nodeFederatedVotingState) {
            console.log('Node not found'); //todo: throw error?
            return [];
        }
        const gossipActions = this.overlay.receiveMessage(message, isDisrupted);
        this.registerEvents(this.overlay.drainEvents());
        if (isDisrupted) {
            return gossipActions;
        }
        this.federatedVotingProtocol.processVote(message.vote, nodeFederatedVotingState);
        const events = this.federatedVotingProtocol.drainEvents();
        this.registerEvents(events);
        return this.processVoteBroadcastRequests(events).concat(gossipActions);
    }
    get nodes() {
        return Array.from(this.state.protocolStates.values()).map((state) => state.node);
    }
    get publicKeysWithQuorumSets() {
        return this.nodes.map((node) => ({
            publicKey: node.publicKey,
            quorumSet: node.quorumSet
        }));
    }
    get overlayConnections() {
        const result = [];
        this.overlay.connections.forEach((connections, publicKey) => {
            result.push({ publicKey, connections: Array.from(connections) });
        });
        return result;
    }
    get overlayIsGossipEnabled() {
        return this.overlay.gossipEnabled;
    }
    get overlayIsFullyConnected() {
        return this.overlay.fullyConnected;
    }
    getOverlaySettings() {
        return {
            gossipEnabled: this.overlayIsGossipEnabled,
            fullyConnected: this.overlayIsFullyConnected
        };
    }
}
exports.FederatedVotingContext = FederatedVotingContext;
