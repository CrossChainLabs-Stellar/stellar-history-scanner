"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Network = void 0;
const index_1 = require("./index");
const network_statistics_1 = __importDefault(require("./network-statistics"));
const typeguards_1 = require("./typeguards");
class Network {
    nodes;
    organizations;
    time;
    latestLedger;
    _trustGraphBuilder;
    _nodesTrustGraph;
    //todo: move organization trust graph to network and only calculate when requested
    _quorumSetService;
    _networkStatistics;
    name;
    id;
    passPhrase;
    overlayMinVersion;
    overlayVersion;
    maxLedgerVersion;
    stellarCoreVersion;
    quorumSetConfiguration;
    // a blocked node is a node that is participating in SCP but cannot validate because its quorumSet cannot
    // reach its threshold.
    blockedNodes = new Set();
    nodesMap;
    organizationsMap = new Map();
    constructor(nodes = [], organizations = [], time = new Date(), latestLedger = null, networkStatistics) {
        this.nodes = nodes;
        this.organizations = organizations;
        this.time = time;
        this.latestLedger = latestLedger;
        this.latestLedger = latestLedger;
        this.nodes = nodes;
        this.organizations = organizations;
        this.time = time;
        this.nodesMap = this.getPublicKeyToNodeMap(nodes);
        this.initializeOrganizationsMap();
        this._quorumSetService = new index_1.QuorumSetService();
        this._trustGraphBuilder = new index_1.TrustGraphBuilder(this);
        this.initializeNodesTrustGraph();
        this.initializeBlockedNodes();
        if (networkStatistics)
            this._networkStatistics = networkStatistics;
        else {
            this._networkStatistics = new network_statistics_1.default();
            this.updateNetworkStatistics();
        }
    }
    /*
    try to determine nodes that are blocked because of their quorumSet. They are participating in SCP, but don't reach consensus.
    There is a chance that a node has a failing quourumSet and is participating in SCP but sending invalid messages on the network.
    But this can only be solved by improving the 'participatingInSCP' detection in the crawler.
     */
    initializeBlockedNodes() {
        this.blockedNodes = new Set(this.nodes
            .filter((node) => node.active &&
            node.isValidator &&
            !node.isValidating &&
            node.activeInScp &&
            !index_1.QuorumSetService.quorumSetCanReachThreshold(node.quorumSet, this, new Set()))
            .map((node) => node.publicKey));
    }
    get networkStatistics() {
        return this._networkStatistics;
    }
    updateNetworkStatistics(fbasAnalysisResult) {
        this.networkStatistics.nrOfActiveWatchers = this.nodes.filter((node) => !node.isValidator && node.active).length;
        this.networkStatistics.nrOfActiveValidators = this.nodes.filter((node) => node.active && node.isValidating && !this.isNodeFailing(node)).length;
        this.networkStatistics.nrOfActiveFullValidators = this.nodes.filter((node) => node.isFullValidator && !this.isNodeFailing(node)).length;
        this.networkStatistics.nrOfActiveOrganizations = this.organizations.filter((organization) => organization.subQuorumAvailable).length;
        this.networkStatistics.transitiveQuorumSetSize =
            this.nodesTrustGraph.networkTransitiveQuorumSet.size;
        this.networkStatistics.hasTransitiveQuorumSet =
            this.nodesTrustGraph.hasNetworkTransitiveQuorumSet();
        if (fbasAnalysisResult) {
            //todo: integrate fbas analyzer wasm implementation
        }
    }
    initializeNodesTrustGraph() {
        this._nodesTrustGraph = this._trustGraphBuilder.buildGraphFromNodes(false);
    }
    initializeOrganizationsMap() {
        this.organizations.forEach((organization) => this.organizationsMap.set(organization.id, organization));
    }
    //call this method when the network was changed externally
    recalculateNetwork() {
        this.nodesMap = this.getPublicKeyToNodeMap(this.nodes);
        this.initializeNodesTrustGraph();
        this.initializeOrganizationsMap();
        //determine if nodes and organizations are blocked due to the changes
        this.blockedNodes = index_1.QuorumSetService.calculateBlockedNodes(this, this.nodesTrustGraph);
        this.updateOrganizationSubQuorumAvailabilityStates();
        this.updateNetworkStatistics();
    }
    /*
    An organization is missing if a simple majority of it's validators are missing.
     */
    isOrganizationMissing(organization) {
        return !organization.subQuorumAvailable;
    }
    /*
    An organization is failing if it is blocked or missing.
     */
    isOrganizationFailing(organization) {
        if (this.isOrganizationBlocked(organization))
            return true;
        return this.isOrganizationMissing(organization);
    }
    /*
      An organization is blocked if due to simulation changes of the network, there aren't enough 'non-blocked' nodes to possibly re-enable it.
     */
    isOrganizationBlocked(organization) {
        if (organization.subQuorumAvailable)
            return false;
        return (organization.validators.filter((validator) => !this.blockedNodes.has(validator)).length < organization.subQuorumThreshold);
    }
    updateOrganizationSubQuorumAvailabilityStates() {
        this.organizations.forEach((organization) => {
            const nrOfValidatingNodes = organization.validators
                .map((validator) => this.getNodeByPublicKey(validator))
                .filter((validator) => !this.isNodeFailing(validator)).length;
            if (nrOfValidatingNodes - organization.subQuorumThreshold < 0)
                organization.subQuorumAvailable = false;
            else
                organization.subQuorumAvailable = true;
        });
    }
    isQuorumSetBlocked(node, innerQuorumSet) {
        //todo should pass graphQuorumSet
        let quorumSet = innerQuorumSet;
        if (quorumSet === undefined) {
            quorumSet = node.quorumSet;
        }
        return !index_1.QuorumSetService.quorumSetCanReachThreshold(quorumSet, this, this.blockedNodes);
    }
    getNodeByPublicKey(publicKey) {
        if (this.nodesMap.has(publicKey))
            return this.nodesMap.get(publicKey);
        else {
            const unknownNode = new index_1.Node(publicKey);
            unknownNode.unknown = true;
            return unknownNode;
        }
    }
    getOrganizationById(id) {
        if (this.organizationsMap.has(id))
            return this.organizationsMap.get(id);
        else {
            const unknownOrganization = new index_1.Organization(id, id);
            unknownOrganization.unknown = true;
            return unknownOrganization;
        }
    }
    get nodesTrustGraph() {
        return this._nodesTrustGraph;
    }
    /*
     * Get nodes that have the given node in their quorumSet
     */
    getTrustingNodes(node) {
        const vertex = this._nodesTrustGraph.getVertex(node.publicKey);
        if (!vertex) {
            return [];
        }
        return Array.from(this._nodesTrustGraph.getParents(vertex)).map((vertex) => this.getNodeByPublicKey(vertex.key));
    }
    //todo => get data from organizationTrustGraph
    getTrustedOrganizations(quorumSet) {
        const trustedOrganizations = [];
        quorumSet.innerQuorumSets.forEach((innerQSet) => {
            if (innerQSet.validators.length === 0) {
                return;
            }
            const organizationId = this.getNodeByPublicKey(innerQSet.validators[0]).organizationId;
            if (organizationId === null ||
                this.getOrganizationById(organizationId) === undefined) {
                return;
            }
            if (!innerQSet.validators
                .map((validator) => this.getNodeByPublicKey(validator))
                .every((validator, index, validators) => validator.organizationId === validators[0].organizationId)) {
                return;
            }
            trustedOrganizations.push(this.getOrganizationById(organizationId));
            trustedOrganizations.push(...this.getTrustedOrganizations(innerQSet));
        });
        return trustedOrganizations;
    }
    getPublicKeyToNodeMap(nodes) {
        return new Map(nodes
            .filter((node) => node.publicKey)
            .map((node) => [node.publicKey, node]));
    }
    getTrustedOrganizationsByOrganization(organization) {
        const trustedOrganizations = [];
        organization.validators.forEach((publicKey) => {
            const validator = this.getNodeByPublicKey(publicKey);
            this.getTrustedOrganizations(validator.quorumSet).forEach((org) => {
                if (org.id !== organization.id)
                    trustedOrganizations.push(org);
            });
        });
        return Array.from(new Set(trustedOrganizations)); //remove doubles
    }
    /**
     * A node can fail for various reasons. See Fig. 5.   Venn diagram of node failures of the original SCP paper.
     * When a node is missing we mark it as failed.
     * If we modify the network for simulation purposes, we mark validators that are blocked as failed.
     */
    isNodeFailing(node) {
        //if a node is blocked, we mark it as failed for simulation purposes
        if (this.blockedNodes.has(node.publicKey))
            return true;
        if (!node.isValidator)
            //watchers are marked missing when we cannot connect to them
            return !node.active;
        return !node.isValidating;
    }
    /*
    Everytime the network is modified for simulation purposes we check if validators can reach their quorumSet thresholds.
    If not we mark them as 'blocked'.
     */
    isValidatorBlocked(validator) {
        return this.blockedNodes.has(validator.publicKey);
    }
    someNodesHaveWarnings(nodes) {
        return nodes.some((node) => this.nodeHasWarnings(node));
    }
    nodeHasWarnings(node) {
        return (this.isFullValidatorWithOutOfDateArchive(node) ||
            this.historyArchiveHasError(node));
    }
    getNodeWarningReasons(node) {
        if (this.historyArchiveHasError(node)) {
            return 'History archive issue detected';
        }
        if (this.isFullValidatorWithOutOfDateArchive(node))
            return 'History archive not up-to-date';
        return 'None';
    }
    isFullValidatorWithOutOfDateArchive(node) {
        return node.historyUrl !== null && !node.isFullValidator;
    }
    historyArchiveHasError(node) {
        return node.historyUrl !== null && node.historyArchiveHasError;
    }
    getNodeFailingReason(node) {
        if (!node.active && !node.isValidator)
            return {
                label: 'Failing',
                description: 'Unable to connect to node during latest crawl'
            };
        if (node.isValidator && !node.quorumSet.hasValidators())
            return {
                label: 'Failing',
                description: 'Quorum set not yet detected by crawler'
            };
        if (node.isValidator && this.isValidatorBlocked(node))
            return {
                label: 'Blocked',
                description: 'Quorum set not reaching threshold'
            };
        if (this.isNodeFailing(node))
            return {
                label: 'Failing',
                description: 'Not validating in latest consensus rounds'
            };
        return {
            label: 'Live',
            description: 'Live'
        };
    }
    static fromJSON(networkV1DTO) {
        const nodes = networkV1DTO.nodes.map((node) => index_1.Node.fromNodeV1DTO(node));
        const organizations = networkV1DTO.organizations.map((organizationDTO) => index_1.Organization.fromOrganizationV1DTO(organizationDTO));
        const networkStatistics = network_statistics_1.default.fromJSON(networkV1DTO.statistics);
        const time = new Date(networkV1DTO.time);
        const network = new Network(nodes, organizations, time, networkV1DTO.latestLedger, networkStatistics);
        network.id = networkV1DTO.id;
        network.name = networkV1DTO.name;
        network.passPhrase = networkV1DTO.passPhrase;
        if ((0, typeguards_1.isNumber)(networkV1DTO.maxLedgerVersion))
            network.maxLedgerVersion = networkV1DTO.maxLedgerVersion;
        if ((0, typeguards_1.isNumber)(networkV1DTO.overlayMinVersion))
            network.overlayMinVersion = networkV1DTO.overlayMinVersion;
        if ((0, typeguards_1.isNumber)(networkV1DTO.overlayVersion))
            network.overlayVersion = networkV1DTO.overlayVersion;
        if ((0, typeguards_1.isString)(networkV1DTO.stellarCoreVersion))
            network.stellarCoreVersion = networkV1DTO.stellarCoreVersion;
        if (networkV1DTO.quorumSetConfiguration)
            network.quorumSetConfiguration = networkV1DTO.quorumSetConfiguration;
        return network;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            time: this.time,
            latestLedger: this.latestLedger,
            transitiveQuorumSet: Array.from(this.nodesTrustGraph.networkTransitiveQuorumSet),
            scc: this.nodesTrustGraph.stronglyConnectedComponents
                .filter((scp) => scp.size > 1)
                .map((scp) => Array.from(scp)),
            nodes: this.nodes,
            organizations: this.organizations,
            statistics: this.networkStatistics
        };
    }
}
exports.Network = Network;
