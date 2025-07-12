"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = void 0;
exports.isOrganization = isOrganization;
const PropertyMapper_1 = __importDefault(require("./PropertyMapper"));
function isOrganization(organization) {
    return organization instanceof Organization;
}
class Organization {
    id;
    name;
    dba = null;
    url = null;
    horizonUrl = null;
    logo = null;
    description = null;
    physicalAddress = null;
    phoneNumber = null;
    keybase = null;
    twitter = null;
    github = null;
    officialEmail = null;
    validators = [];
    subQuorumAvailable = false;
    has30DayStats = false;
    has24HourStats = false;
    subQuorum24HoursAvailability = 0;
    subQuorum30DaysAvailability = 0;
    unknown = false;
    homeDomain = null; //todo: not nullable
    tomlState = 'Unknown';
    dateDiscovered;
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    get subQuorumBlockedAt() {
        return this.validators.length - this.subQuorumThreshold + 1;
    }
    get subQuorumThreshold() {
        return Math.floor(this.validators.length - (this.validators.length - 1) / 2); //simple majority
    }
    get hasReliableUptime() {
        if (!this.has30DayStats)
            return false;
        return (this.subQuorum30DaysAvailability >= 99 && this.validators.length >= 3);
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            dba: this.dba,
            url: this.url,
            horizonUrl: this.horizonUrl,
            logo: this.logo,
            description: this.description,
            physicalAddress: this.physicalAddress,
            phoneNumber: this.phoneNumber,
            keybase: this.keybase,
            twitter: this.twitter,
            github: this.github,
            officialEmail: this.officialEmail,
            validators: this.validators,
            subQuorumAvailable: this.subQuorumAvailable,
            subQuorum24HoursAvailability: this.subQuorum24HoursAvailability,
            subQuorum30DaysAvailability: this.subQuorum30DaysAvailability,
            has30DayStats: this.has30DayStats,
            has24HourStats: this.has24HourStats,
            dateDiscovered: this.dateDiscovered?.toISOString() ?? new Date().toISOString(),
            hasReliableUptime: this.hasReliableUptime,
            homeDomain: this.homeDomain ?? 'unknown',
            tomlState: this.tomlState
        };
    }
    static fromOrganizationV1DTO(organizationV1DTO) {
        const organization = new Organization(organizationV1DTO.id, organizationV1DTO.name ?? organizationV1DTO.id);
        PropertyMapper_1.default.mapProperties(organizationV1DTO, organization, [
            'id',
            'name',
            'dateDiscovered',
            'hasReliableUptime'
        ]);
        organization.dateDiscovered = new Date(organizationV1DTO.dateDiscovered);
        return organization;
    }
    toString() {
        return `Organization (id: ${this.id}, name: ${this.name})`;
    }
}
exports.Organization = Organization;
