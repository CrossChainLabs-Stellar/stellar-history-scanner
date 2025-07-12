"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleAdjacencyMatrixVisualization = void 0;
class ConsoleAdjacencyMatrixVisualization {
    visualize(nodes) {
        const nodeIds = nodes.map((node) => node.publicKey);
        const nodeIndexMap = {};
        nodeIds.forEach((id, index) => {
            nodeIndexMap[id] = index;
        });
        // Initialize an empty adjacency matrix
        const adjacencyMatrix = this.initializeMatrix(nodeIds.length);
        // Populate the adjacency matrix
        nodes.forEach((node) => {
            const nodeIndex = nodeIndexMap[node.publicKey];
            node.connections.forEach((connection) => {
                const connectionIndex = nodeIndexMap[connection];
                adjacencyMatrix[nodeIndex][connectionIndex] = 'x';
                adjacencyMatrix[connectionIndex][nodeIndex] = 'x'; // Since it's undirected
            });
        });
        // Print the adjacency matrix
        this.printMatrix(nodeIds, adjacencyMatrix);
    }
    initializeMatrix(size) {
        const matrix = [];
        for (let i = 0; i < size; i++) {
            matrix.push(new Array(size).fill('.'));
            matrix[i][i] = 'x';
        }
        return matrix;
    }
    printMatrix(nodeIds, matrix) {
        const maxLength = Math.max(...nodeIds.map((id) => id.length));
        const header = ' '.padEnd(maxLength + 1) +
            nodeIds.map((id) => id.padEnd(maxLength)).join(' ');
        console.log(header);
        console.log(' '.padEnd(maxLength + 1) + '-'.repeat(header.length - 3));
        matrix.forEach((row, index) => {
            const rowString = nodeIds[index].padEnd(maxLength) +
                '| ' +
                row.map((cell) => cell.toString().padEnd(maxLength)).join(' ');
            console.log(rowString);
        });
    }
}
exports.ConsoleAdjacencyMatrixVisualization = ConsoleAdjacencyMatrixVisualization;
