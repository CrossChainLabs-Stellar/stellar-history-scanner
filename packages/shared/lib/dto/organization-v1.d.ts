import { JSONSchemaType } from 'ajv';
export interface OrganizationV1 {
    id: string;
    name: string | null;
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
    validators: string[];
    subQuorumAvailable: boolean;
    has30DayStats: boolean;
    has24HourStats: boolean;
    subQuorum24HoursAvailability: number;
    subQuorum30DaysAvailability: number;
    homeDomain: string;
    dateDiscovered: string;
    hasReliableUptime: boolean;
    tomlState: string;
}
export declare const OrganizationV1Schema: JSONSchemaType<OrganizationV1>;
//# sourceMappingURL=organization-v1.d.ts.map