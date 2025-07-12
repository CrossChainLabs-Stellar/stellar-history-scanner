"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkTransitiveQuorumSetFinder = void 0;
const trust_graph_1 = require("./trust-graph");
class NetworkTransitiveQuorumSetFinder {
    getTransitiveQuorumSet(stronglyConnectedComponents, graph) {
        const scpNoOutgoingEdges = [];
        stronglyConnectedComponents.forEach((scp) => {
            if (scp.size > 1 &&
                !this.hasOutgoingEdgesNotPartOfComponent(scp, graph)) {
                scpNoOutgoingEdges.push(scp);
            }
        });
        if (scpNoOutgoingEdges.length <= 0) {
            return new Set();
        }
        let transitiveQuorumSet = scpNoOutgoingEdges[0];
        if (scpNoOutgoingEdges.length > 1) {
            let highestIndexAverage = 0;
            for (let i = 0; i < scpNoOutgoingEdges.length; i++) {
                const scp = scpNoOutgoingEdges[i];
                const weightSum = Array.from(scp)
                    .map((vertexKey) => graph.getVertex(vertexKey))
                    .filter(trust_graph_1.isVertex)
                    .reduce((accumulator, vertex) => accumulator + vertex.weight, 0);
                const weightAverage = weightSum / scp.size;
                if (highestIndexAverage < weightAverage) {
                    transitiveQuorumSet = scp;
                    highestIndexAverage = weightAverage;
                }
            }
        }
        return transitiveQuorumSet;
    }
    hasOutgoingEdgesNotPartOfComponent(stronglyConnectedComponent, graph) {
        let hasOutgoingEdgesNotPartOfComponent = false;
        Array.from(stronglyConnectedComponent.values())
            .map((publicKey) => graph.getVertex(publicKey))
            .filter(trust_graph_1.isVertex)
            .forEach((vertex) => {
            const outgoingEdgesNotInComponent = Array.from(graph.getChildren(vertex)).filter((child) => !stronglyConnectedComponent.has(child.key));
            if (outgoingEdgesNotInComponent.length > 0)
                hasOutgoingEdgesNotPartOfComponent = true;
        });
        return hasOutgoingEdgesNotPartOfComponent;
    }
}
exports.NetworkTransitiveQuorumSetFinder = NetworkTransitiveQuorumSetFinder;
