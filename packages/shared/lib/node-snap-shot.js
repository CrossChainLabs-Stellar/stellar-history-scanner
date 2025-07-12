"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeSnapShot = void 0;
const node_1 = require("./node");
class NodeSnapShot {
    startDate;
    endDate;
    node;
    constructor(startDate, endDate, node) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.node = node;
    }
    toJSON() {
        return {
            startDate: this.startDate,
            endDate: this.endDate,
            node: this.node
        };
    }
    static fromNodeSnapshotV1(nodeSnapshotV1DTO) {
        return new NodeSnapShot(new Date(nodeSnapshotV1DTO.startDate), new Date(nodeSnapshotV1DTO.endDate), node_1.Node.fromNodeV1DTO(nodeSnapshotV1DTO.node));
    }
}
exports.NodeSnapShot = NodeSnapShot;
