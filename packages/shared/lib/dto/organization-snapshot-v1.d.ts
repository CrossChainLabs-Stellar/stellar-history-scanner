import { JSONSchemaType } from "ajv";
import { OrganizationV1 } from "./organization-v1";
export interface OrganizationSnapshotV1 {
    startDate: string;
    endDate: string;
    organization: OrganizationV1;
}
export declare const OrganizationSnapshotV1Schema: JSONSchemaType<OrganizationSnapshotV1>;
//# sourceMappingURL=organization-snapshot-v1.d.ts.map