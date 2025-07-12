"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeGeoData = void 0;
class NodeGeoData {
    countryCode = null;
    countryName = null;
    latitude = null;
    longitude = null;
    toJSON() {
        return {
            countryCode: this.countryCode,
            countryName: this.countryName,
            latitude: this.latitude,
            longitude: this.longitude
        };
    }
    static fromNodeGeoDataV1(nodeGeoDataV1) {
        const newNodeGeo = new NodeGeoData();
        newNodeGeo.countryCode = nodeGeoDataV1.countryCode;
        newNodeGeo.countryName = nodeGeoDataV1.countryName;
        newNodeGeo.latitude = nodeGeoDataV1.latitude;
        newNodeGeo.longitude = nodeGeoDataV1.longitude;
        return newNodeGeo;
    }
}
exports.NodeGeoData = NodeGeoData;
