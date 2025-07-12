import { BaseQuorumSet } from '../quorum-set';
import { JSONSchemaType } from 'ajv';
export interface NodeGeoDataV1 {
    countryCode: string | null;
    countryName: string | null;
    latitude: number | null;
    longitude: number | null;
}
export interface NodeStatisticsV1 {
    active30DaysPercentage: number;
    overLoaded30DaysPercentage: number;
    validating30DaysPercentage: number;
    active24HoursPercentage: number;
    overLoaded24HoursPercentage: number;
    validating24HoursPercentage: number;
    has30DayStats: boolean;
    has24HourStats: boolean;
}
export interface NodeV1 {
    ip: string;
    port: number;
    publicKey: string;
    name: string | null;
    host: string | null;
    ledgerVersion: number | null;
    overlayVersion: number | null;
    overlayMinVersion: number | null;
    versionStr: string | null;
    quorumSet: BaseQuorumSet | null;
    quorumSetHashKey: string | null;
    active: boolean;
    activeInScp: boolean;
    geoData: NodeGeoDataV1 | null;
    statistics: NodeStatisticsV1;
    dateDiscovered: string;
    dateUpdated: string;
    overLoaded: boolean;
    isFullValidator: boolean;
    isValidating: boolean;
    homeDomain: string | null;
    index: number;
    historyUrl: string | null;
    alias: string | null;
    isp: string | null;
    organizationId: string | null;
    historyArchiveHasError: boolean;
    isValidator: boolean;
    connectivityError: boolean;
    stellarCoreVersionBehind: boolean;
    lag: number | null;
}
export declare const NodeV1Schema: JSONSchemaType<NodeV1>;
//# sourceMappingURL=node-v1.d.ts.map