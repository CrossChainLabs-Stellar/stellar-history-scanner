"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSnapShot = void 0;
const organization_1 = require("./organization");
class OrganizationSnapShot {
    startDate;
    endDate;
    organization;
    constructor(startDate, endDate, organization) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.organization = organization;
    }
    toJSON() {
        return {
            startDate: this.startDate,
            endDate: this.endDate,
            organization: this.organization
        };
    }
    static fromOrganizationSnapShotV1DTO(snapShotObject) {
        return new OrganizationSnapShot(new Date(snapShotObject.startDate), new Date(snapShotObject.endDate), organization_1.Organization.fromOrganizationV1DTO(snapShotObject.organization));
    }
}
exports.OrganizationSnapShot = OrganizationSnapShot;
