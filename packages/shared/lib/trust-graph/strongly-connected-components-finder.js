"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StronglyConnectedComponentsFinder = void 0;
/*
A directed graph is called strongly connected if there is a path in each direction between each pair of _vertices of the graph.
That is, a path exists from the first vertex in the pair to the second, and another path exists from the second vertex to the first.
 */
class StronglyConnectedComponentsFinder {
    _time = 0;
    depthFirstSearch(atVertex, graph, visitedVertices, low, stack, onStack, stronglyConnectedComponents) {
        visitedVertices.set(atVertex, this._time);
        low.set(atVertex, this._time);
        stack.push(atVertex);
        onStack.set(atVertex, true);
        this._time++;
        Array.from(graph.getChildren(atVertex)).forEach((toVertex) => {
            if (visitedVertices.get(toVertex) === undefined) {
                this.depthFirstSearch(toVertex, graph, visitedVertices, low, stack, onStack, stronglyConnectedComponents);
            }
            if (onStack.get(toVertex) === true) {
                low.set(atVertex, Math.min(low.get(atVertex), low.get(toVertex)));
            }
        });
        if (visitedVertices.get(atVertex) === low.get(atVertex)) {
            const stronglyConnectedComponent = new Set();
            let done = false;
            while (!done) {
                const poppedVertex = stack.pop();
                onStack.set(poppedVertex, false);
                stronglyConnectedComponent.add(poppedVertex.key);
                if (poppedVertex === atVertex) {
                    done = true;
                }
            }
            stronglyConnectedComponents.push(stronglyConnectedComponent);
        }
    }
    findTarjan(graph) {
        this._time = 0;
        const visitedVertices = new Map();
        const low = new Map();
        const stack = [];
        const onStack = new Map();
        const stronglyConnectedComponents = [];
        Array.from(graph.vertices.values()).forEach((vertex) => {
            if (visitedVertices.get(vertex) === undefined) {
                this.depthFirstSearch(vertex, graph, visitedVertices, low, stack, onStack, stronglyConnectedComponents);
            }
        });
        return stronglyConnectedComponents;
    }
}
exports.StronglyConnectedComponentsFinder = StronglyConnectedComponentsFinder;
