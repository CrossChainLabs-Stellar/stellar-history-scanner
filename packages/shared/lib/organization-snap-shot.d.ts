import { Organization } from './organization';
import { OrganizationSnapshotV1 } from "./dto/organization-snapshot-v1";
export declare class OrganizationSnapShot {
    startDate: Date;
    endDate: Date;
    organization: Organization;
    constructor(startDate: Date, endDate: Date, organization: Organization);
    toJSON(): Record<string, unknown>;
    static fromOrganizationSnapShotV1DTO(snapShotObject: OrganizationSnapshotV1): OrganizationSnapShot;
}
//# sourceMappingURL=organization-snap-shot.d.ts.map