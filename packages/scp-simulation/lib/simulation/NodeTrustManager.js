"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeTrustManager = void 0;
const core_1 = require("../core");
const UpdateQuorumSet_1 = require("../federated-voting/action/user/UpdateQuorumSet");
/**
 * Manages trust relationships between nodes. Takes into account pending updates.
 *
 * I am still debating what the right location for this class is.
 */
class NodeTrustManager {
    simulation;
    constructor(simulation) {
        this.simulation = simulation;
    }
    /**
     * Gets all pending UpdateQuorumSet actions
     */
    getPendingUpdates() {
        return this.simulation
            .pendingUserActions()
            .filter((action) => action.subType === 'UpdateQuorumSet')
            .reduce((acc, action) => {
            acc.set(action.publicKey, action);
            return acc;
        }, new Map());
    }
    /**
     * Checks if a node trusts another node
     */
    isTrusted(node, otherNode) {
        const pendingUpdates = this.getPendingUpdates();
        const pendingUpdate = pendingUpdates.get(node.publicKey);
        if (pendingUpdate) {
            return pendingUpdate.quorumSet.validators.includes(otherNode.publicKey);
        }
        return node.quorumSet.validators.includes(otherNode.publicKey);
    }
    /**
     * Toggles trust between two nodes
     */
    toggleTrust(node, otherNode) {
        let validators;
        let threshold;
        const pendingUpdates = this.getPendingUpdates();
        const pendingUpdate = pendingUpdates.get(node.publicKey);
        if (pendingUpdate) {
            validators = [...pendingUpdate.quorumSet.validators];
            threshold = pendingUpdate.quorumSet.threshold;
        }
        else {
            validators = [...node.quorumSet.validators];
            threshold = node.quorumSet.threshold;
        }
        const isCurrentlyTrusted = validators.includes(otherNode.publicKey);
        if (isCurrentlyTrusted) {
            // Remove trust
            validators = validators.filter((v) => v !== otherNode.publicKey);
            threshold = Math.min(threshold, validators.length);
            if (validators.length > 0 && threshold < 1)
                threshold = 1;
        }
        else {
            // Add trust
            validators.push(otherNode.publicKey);
        }
        this.updateQuorumSet(node, threshold, validators);
    }
    /**
     * Updates threshold for a node's quorum set
     */
    updateThreshold(node, newThreshold) {
        const pendingUpdates = this.getPendingUpdates();
        const pendingUpdate = pendingUpdates.get(node.publicKey);
        let validators;
        if (pendingUpdate) {
            validators = [...pendingUpdate.quorumSet.validators];
        }
        else {
            validators = [...node.quorumSet.validators];
        }
        this.updateQuorumSet(node, newThreshold, validators);
    }
    /**
     * Gets validator count considering pending updates
     */
    getValidatorCount(node) {
        const pendingUpdates = this.getPendingUpdates();
        const pendingUpdate = pendingUpdates.get(node.publicKey);
        if (pendingUpdate) {
            return pendingUpdate.quorumSet.validators.length;
        }
        return node.quorumSet.validators.length;
    }
    /**
     * Gets current threshold considering pending updates
     */
    getCurrentThreshold(node) {
        const pendingUpdates = this.getPendingUpdates();
        const pendingUpdate = pendingUpdates.get(node.publicKey);
        if (pendingUpdate) {
            return pendingUpdate.quorumSet.threshold;
        }
        return node.quorumSet.threshold;
    }
    /**
     * Updates a node's quorum set with new validators and threshold
     * @private
     */
    updateQuorumSet(node, threshold, validators) {
        this.removeExistingUpdateForNode(node.publicKey);
        // Check if the new configuration is identical to the original
        const isIdenticalToOriginal = threshold === node.quorumSet.threshold &&
            validators.length === node.quorumSet.validators.length &&
            validators.every((v) => node.quorumSet.validators.includes(v));
        // Only create a new action if there's an actual change
        if (!isIdenticalToOriginal) {
            const newQuorumSet = new core_1.QuorumSet(threshold, validators, node.quorumSet.innerQuorumSets);
            const action = new UpdateQuorumSet_1.UpdateQuorumSet(node.publicKey, newQuorumSet);
            this.simulation.addUserAction(action);
        }
    }
    /**
     * Removes existing update actions for a node
     * @private
     */
    removeExistingUpdateForNode(publicKey) {
        const actions = this.simulation.pendingUserActions();
        for (let i = actions.length - 1; i >= 0; i--) {
            const ua = actions[i];
            if (ua.subType === 'UpdateQuorumSet' && ua.publicKey === publicKey) {
                actions.splice(i, 1);
            }
        }
    }
}
exports.NodeTrustManager = NodeTrustManager;
