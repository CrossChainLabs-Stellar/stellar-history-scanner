import { Node } from '../core';
import { UpdateQuorumSet } from '../federated-voting/action/user/UpdateQuorumSet';
import { Simulation } from '../simulation/Simulation';
/**
 * Manages trust relationships between nodes. Takes into account pending updates.
 *
 * I am still debating what the right location for this class is.
 */
export declare class NodeTrustManager {
    private simulation;
    constructor(simulation: Simulation);
    /**
     * Gets all pending UpdateQuorumSet actions
     */
    getPendingUpdates(): Map<string, UpdateQuorumSet>;
    /**
     * Checks if a node trusts another node
     */
    isTrusted(node: Node, otherNode: Node): boolean;
    /**
     * Toggles trust between two nodes
     */
    toggleTrust(node: Node, otherNode: Node): void;
    /**
     * Updates threshold for a node's quorum set
     */
    updateThreshold(node: Node, newThreshold: number): void;
    /**
     * Gets validator count considering pending updates
     */
    getValidatorCount(node: Node): number;
    /**
     * Gets current threshold considering pending updates
     */
    getCurrentThreshold(node: Node): number;
    /**
     * Updates a node's quorum set with new validators and threshold
     * @private
     */
    private updateQuorumSet;
    /**
     * Removes existing update actions for a node
     * @private
     */
    private removeExistingUpdateForNode;
}
//# sourceMappingURL=NodeTrustManager.d.ts.map