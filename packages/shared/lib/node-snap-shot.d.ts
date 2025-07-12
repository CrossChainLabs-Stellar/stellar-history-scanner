import { Node } from './node';
import { NodeSnapshotV1 } from "./dto/node-snapshot-v1";
export declare class NodeSnapShot {
    startDate: Date;
    endDate: Date;
    node: Node;
    constructor(startDate: Date, endDate: Date, node: Node);
    toJSON(): Record<string, unknown>;
    static fromNodeSnapshotV1(nodeSnapshotV1DTO: NodeSnapshotV1): NodeSnapShot;
}
//# sourceMappingURL=node-snap-shot.d.ts.map