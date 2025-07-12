"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeerNodeCollection = void 0;
const peer_node_1 = require("./peer-node");
class PeerNodeCollection {
    peerNodes;
    constructor(peerNodes = new Map()) {
        this.peerNodes = peerNodes;
    }
    addExternalizedValueForPeerNode(publicKey, slotIndex, value, localTime) {
        const peerNode = this.getOrAdd(publicKey);
        peerNode.addExternalizedValue(slotIndex, localTime, value);
    }
    getOrAdd(publicKey) {
        let peerNode = this.peerNodes.get(publicKey);
        if (peerNode)
            return peerNode;
        peerNode = new peer_node_1.PeerNode(publicKey);
        this.peerNodes.set(publicKey, peerNode);
        return peerNode;
    }
    get(publicKey) {
        return this.peerNodes.get(publicKey);
    }
    addSuccessfullyConnected(publicKey, ip, port, nodeInfo) {
        let peerNode = this.peerNodes.get(publicKey);
        if (peerNode && peerNode.successfullyConnected) {
            return new Error('PeerNode reusing publicKey');
        }
        if (!peerNode) {
            peerNode = new peer_node_1.PeerNode(publicKey);
        }
        peerNode.nodeInfo = nodeInfo;
        peerNode.ip = ip;
        peerNode.port = port;
        peerNode.successfullyConnected = true;
        this.peerNodes.set(publicKey, peerNode);
        return peerNode;
    }
    getAll() {
        return this.peerNodes;
    }
    values() {
        return this.peerNodes.values();
    }
    get size() {
        return this.peerNodes.size;
    }
    setPeerOverloaded(publicKey, overloaded) {
        const peer = this.peerNodes.get(publicKey);
        if (peer) {
            peer.overLoaded = overloaded;
        }
    }
    setPeerSuppliedPeerList(publicKey, suppliedPeerList) {
        const peer = this.peerNodes.get(publicKey);
        if (peer) {
            peer.suppliedPeerList = suppliedPeerList;
        }
    }
    confirmLedgerCloseForNode(publicKey, closedLedger) {
        const peer = this.getOrAdd(publicKey);
        peer.processConfirmedLedgerClose(closedLedger);
    }
    //convenience method to avoid having to loop through all peers
    confirmLedgerCloseForDisagreeingNodes(disagreeingNodes) {
        for (const publicKey of disagreeingNodes) {
            const peer = this.peerNodes.get(publicKey);
            if (peer) {
                peer.isValidatingIncorrectValues = true;
            }
        }
    }
    //convenience method to avoid having to loop through all peers
    confirmLedgerCloseForValidatingNodes(validatingNodes, ledger) {
        for (const publicKey of validatingNodes) {
            const peer = this.peerNodes.get(publicKey);
            if (peer) {
                peer.processConfirmedLedgerClose(ledger);
            }
        }
    }
}
exports.PeerNodeCollection = PeerNodeCollection;
