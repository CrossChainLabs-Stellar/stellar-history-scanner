import { OrganizationId, PublicKey } from './network';
import { OrganizationV1 } from './dto/organization-v1';
export declare function isOrganization(organization: Organization | undefined): organization is Organization;
export declare class Organization {
    readonly id: OrganizationId;
    name: string;
    dba: string | null;
    url: string | null;
    horizonUrl: string | null;
    logo: string | null;
    description: string | null;
    physicalAddress: string | null;
    phoneNumber: string | null;
    keybase: string | null;
    twitter: string | null;
    github: string | null;
    officialEmail: string | null;
    validators: PublicKey[];
    subQuorumAvailable: boolean;
    has30DayStats: boolean;
    has24HourStats: boolean;
    subQuorum24HoursAvailability: number;
    subQuorum30DaysAvailability: number;
    unknown: boolean;
    homeDomain: string | null;
    tomlState: string;
    dateDiscovered?: Date;
    constructor(id: string, name: string);
    get subQuorumBlockedAt(): number;
    get subQuorumThreshold(): number;
    get hasReliableUptime(): boolean;
    toJSON(): OrganizationV1;
    static fromOrganizationV1DTO(organizationV1DTO: OrganizationV1): Organization;
    toString(): string;
}
//# sourceMappingURL=organization.d.ts.map