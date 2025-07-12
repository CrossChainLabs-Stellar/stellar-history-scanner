import { JSONSchemaType } from "ajv";
import { NodeV1 } from "./node-v1";
export interface NodeSnapshotV1 {
    startDate: string;
    endDate: string;
    node: NodeV1;
}
export declare const NodeSnapshotV1Schema: JSONSchemaType<NodeSnapshotV1>;
//# sourceMappingURL=node-snapshot-v1.d.ts.map