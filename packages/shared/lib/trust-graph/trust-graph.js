"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrustGraph = exports.Edge = exports.Vertex = void 0;
exports.isVertex = isVertex;
class Vertex {
    key;
    label;
    weight;
    constructor(publicKey, label, weight) {
        this.label = label;
        this.key = publicKey;
        this.weight = weight;
    }
    toString() {
        return `Vertex (publicKey: ${this.key}, label: ${this.label})`;
    }
}
exports.Vertex = Vertex;
function isVertex(vertex) {
    return vertex instanceof Vertex;
}
class Edge {
    parent;
    child;
    constructor(parent, child) {
        this.parent = parent;
        this.child = child;
    }
    toString() {
        return `Edge (parent: ${this.parent.key}, child: ${this.child.key})`;
    }
}
exports.Edge = Edge;
class TrustGraph {
    _stronglyConnectedComponentsFinder;
    _networkTransitiveQuorumSetFinder;
    _vertices = new Map();
    _edges = new Set();
    _stronglyConnectedComponents = [];
    _stronglyConnectedVertices = new Map();
    _networkTransitiveQuorumSet = new Set();
    children = new Map();
    parents = new Map();
    constructor(stronglyConnectedComponentsFinder, networkTransitiveQuorumSetFinder) {
        this._stronglyConnectedComponentsFinder = stronglyConnectedComponentsFinder;
        this._networkTransitiveQuorumSetFinder = networkTransitiveQuorumSetFinder;
    }
    updateStronglyConnectedComponentsAndNetworkTransitiveQuorumSet() {
        this._stronglyConnectedComponents =
            this._stronglyConnectedComponentsFinder.findTarjan(this);
        this._stronglyConnectedVertices = new Map();
        for (let i = 0; i < this._stronglyConnectedComponents.length; i++) {
            this._stronglyConnectedComponents[i].forEach((publicKey) => this._stronglyConnectedVertices.set(publicKey, i));
        }
        this._networkTransitiveQuorumSet =
            this._networkTransitiveQuorumSetFinder.getTransitiveQuorumSet(this._stronglyConnectedComponents, this);
    }
    hasNetworkTransitiveQuorumSet() {
        return this._networkTransitiveQuorumSet.size > 0;
    }
    get networkTransitiveQuorumSet() {
        return this._networkTransitiveQuorumSet;
    }
    addVertex(vertex) {
        this._vertices.set(vertex.key, vertex);
        this.children.set(vertex.key, new Set());
        this.parents.set(vertex.key, new Set());
    }
    getInDegree(vertex) {
        if (!this.parents.has(vertex.key)) {
            throw new Error('Vertex not part of graph: ' + vertex);
        }
        return this.parents.get(vertex.key).size;
    }
    getOutDegree(vertex) {
        if (!this.children.has(vertex.key)) {
            throw new Error('Vertex not part of graph: ' + vertex);
        }
        return this.children.get(vertex.key).size;
    }
    isVertexPartOfNetworkTransitiveQuorumSet(publicKey) {
        return this._networkTransitiveQuorumSet.has(publicKey);
    }
    getStronglyConnectedComponent(key) {
        return this._stronglyConnectedVertices.get(key);
    }
    isVertexPartOfStronglyConnectedComponent(publicKey) {
        return this._stronglyConnectedVertices.has(publicKey);
    }
    isEdgePartOfNetworkTransitiveQuorumSet(edge) {
        return (this._networkTransitiveQuorumSet.has(edge.parent.key) &&
            this._networkTransitiveQuorumSet.has(edge.child.key));
    }
    isEdgePartOfStronglyConnectedComponent(edge) {
        return (this._stronglyConnectedVertices.has(edge.parent.key) &&
            this._stronglyConnectedVertices.has(edge.child.key) &&
            this._stronglyConnectedVertices.get(edge.parent.key) ===
                this._stronglyConnectedVertices.get(edge.child.key));
    }
    hasVertex(publicKey) {
        return this._vertices.has(publicKey);
    }
    getVertex(publicKey) {
        return this._vertices.get(publicKey);
    }
    getChildren(vertex) {
        if (!this.vertices.has(vertex.key)) {
            throw new Error('Vertex not part of graph: ' + vertex);
        }
        return this.children.get(vertex.key);
    }
    getTransitiveChildren(vertex) {
        const children = new Set();
        const getChildrenRecursive = (vertex, children) => {
            this.getChildren(vertex).forEach((child) => {
                if (!children.has(child)) {
                    children.add(child);
                    getChildrenRecursive(child, children);
                }
            });
        };
        getChildrenRecursive(vertex, children);
        return children;
    }
    hasChild(parent, child) {
        const children = this.children.get(parent.key);
        if (!children)
            return false;
        return children.has(child);
    }
    getParents(vertex) {
        if (!this.vertices.has(vertex.key)) {
            throw new Error('Vertex not part of graph: ' + vertex);
        }
        return this.parents.get(vertex.key);
    }
    addEdge(edge) {
        if (!this._vertices.has(edge.parent.key)) {
            throw new Error('unknown vertex: ' + edge.parent);
        }
        if (!this._vertices.has(edge.child.key)) {
            throw new Error('unknown vertex: ' + edge.child);
        }
        this._edges.add(edge);
        this.children.get(edge.parent.key).add(edge.child);
        this.parents.get(edge.child.key).add(edge.parent);
    }
    get vertices() {
        return this._vertices;
    }
    get edges() {
        return this._edges;
    }
    get stronglyConnectedComponents() {
        return this._stronglyConnectedComponents;
    }
}
exports.TrustGraph = TrustGraph;
