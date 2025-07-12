import { NodeGeoDataV1 } from "./dto/node-v1";
export declare class NodeGeoData {
    countryCode: string | null;
    countryName: string | null;
    latitude: number | null;
    longitude: number | null;
    toJSON(): Record<string, unknown>;
    static fromNodeGeoDataV1(nodeGeoDataV1: NodeGeoDataV1): NodeGeoData;
}
//# sourceMappingURL=node-geo-data.d.ts.map