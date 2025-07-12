"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrustGraphBuilder = void 0;
const quorum_set_1 = require("../quorum-set");
const strongly_connected_components_finder_1 = require("./strongly-connected-components-finder");
const network_transitive_quorum_set_finder_1 = require("./network-transitive-quorum-set-finder");
const trust_graph_1 = require("./trust-graph");
class TrustGraphBuilder {
    /*
    Network is used to fetch nodes and organizations by ID, ideally this should come from a repository, and not the entire network service.
     */
    network;
    constructor(network) {
        this.network = network;
    }
    buildGraphFromOrganizations() {
        const graph = new trust_graph_1.TrustGraph(new strongly_connected_components_finder_1.StronglyConnectedComponentsFinder(), new network_transitive_quorum_set_finder_1.NetworkTransitiveQuorumSetFinder());
        //add vertices
        this.network.organizations.forEach((organization) => {
            graph.addVertex(new trust_graph_1.Vertex(organization.id, organization.name, 1 //todo: index
            ));
        });
        //add edges
        graph.vertices.forEach((organizationVertex) => {
            const organization = this.network.getOrganizationById(organizationVertex.key);
            if (!organization)
                return;
            organization.validators.forEach((validator) => {
                quorum_set_1.QuorumSet.getAllValidators(this.network.getNodeByPublicKey(validator).quorumSet)
                    .map((validator) => this.network.getNodeByPublicKey(validator).organizationId)
                    .filter((organizationId) => organizationId !== undefined)
                    .map((organizationId) => this.network.getOrganizationById(organizationId))
                    .forEach((trustedOrganization) => {
                    const trustedOrganizationVertex = graph.getVertex(trustedOrganization.id);
                    if (!(0, trust_graph_1.isVertex)(trustedOrganizationVertex))
                        return;
                    if (!graph.hasChild(organizationVertex, trustedOrganizationVertex))
                        graph.addEdge(new trust_graph_1.Edge(organizationVertex, trustedOrganizationVertex));
                });
            });
        });
        graph.updateStronglyConnectedComponentsAndNetworkTransitiveQuorumSet();
        return graph;
    }
    buildGraphFromNodes(includeWatchers = false) {
        const graph = new trust_graph_1.TrustGraph(new strongly_connected_components_finder_1.StronglyConnectedComponentsFinder(), new network_transitive_quorum_set_finder_1.NetworkTransitiveQuorumSetFinder());
        this.network.nodes //first we create the vertices
            .filter((node) => node.isValidator || includeWatchers)
            .forEach((node) => {
            graph.addVertex(new trust_graph_1.Vertex(node.publicKey, node.displayName, node.index));
        });
        graph.vertices.forEach((vertex) => {
            //now we add the edges, the trust connections
            const node = this.network.getNodeByPublicKey(vertex.key);
            this.addNodeEdges(vertex, node.quorumSet, graph);
        });
        graph.updateStronglyConnectedComponentsAndNetworkTransitiveQuorumSet();
        return graph;
    }
    addNodeEdges(parent, quorumSet, graph) {
        const validators = quorum_set_1.QuorumSet.getAllValidators(quorumSet);
        validators.forEach((validator) => {
            const vertex = graph.getVertex(validator);
            /*if (!vertex) {//it could be that a node is not yet detected validating, but is included in quorumsets.
                let node = this.network.getNodeByPublicKey(validator);//perhaps we already discovered it as a watcher
                if (!node)//if not let's add an unknown node
                    node = new Node(validator);

                vertex = new Vertex(validator, node.displayName, node.index);
                graph.addVertex(vertex);
            }*/ //if we add a node where we have no quorumset information, adding that node could break transitive quorumset calculation (outgoing edges?). Another solution is to introduce an 'unknown' property to vertex and filter it out in sensitive calculations. For now we remove it from the graph.
            if (vertex)
                graph.addEdge(new trust_graph_1.Edge(parent, vertex));
        });
    }
}
exports.TrustGraphBuilder = TrustGraphBuilder;
