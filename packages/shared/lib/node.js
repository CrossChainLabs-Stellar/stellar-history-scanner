"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
const node_geo_data_1 = require("./node-geo-data");
const node_statistics_1 = require("./node-statistics");
const quorum_set_1 = require("./quorum-set");
const PropertyMapper_1 = __importDefault(require("./PropertyMapper"));
class Node {
    ip;
    port;
    publicKey;
    name = null;
    host = null;
    ledgerVersion = null;
    overlayVersion = null;
    overlayMinVersion = null;
    versionStr = null;
    quorumSet = new quorum_set_1.QuorumSet();
    quorumSetHashKey = null;
    active = false;
    activeInScp = false;
    geoData = new node_geo_data_1.NodeGeoData();
    statistics = new node_statistics_1.NodeStatistics();
    dateDiscovered = new Date();
    dateUpdated = new Date();
    overLoaded = false;
    isFullValidator = false;
    isValidating = false;
    homeDomain = null;
    index = 0.0;
    historyUrl = null;
    alias = null;
    isp = null;
    organizationId = null;
    unknown = false; //a node is unknown if it is not crawled or maybe archived
    historyArchiveHasError = false;
    connectivityError = false;
    stellarCoreVersionBehind = false;
    lag = null;
    constructor(publicKey, ip = '127.0.0.1', port = 11625) {
        this.ip = ip;
        this.port = port;
        this.publicKey = publicKey;
    }
    get displayName() {
        if (this.name) {
            return this.name;
        }
        if (this.publicKey)
            return (this.publicKey.substring(0, 10) +
                '...' +
                this.publicKey.substring(50, 150));
        return '';
    }
    get key() {
        return this.ip + ':' + this.port;
    }
    get isValidator() {
        return this.isValidating || this.quorumSet.hasValidators();
    }
    toJSON() {
        return {
            ip: this.ip,
            port: this.port,
            host: this.host,
            publicKey: this.publicKey,
            name: this.name,
            ledgerVersion: this.ledgerVersion,
            overlayVersion: this.overlayVersion,
            overlayMinVersion: this.overlayMinVersion,
            versionStr: this.versionStr,
            active: this.active,
            activeInScp: this.activeInScp,
            overLoaded: this.overLoaded,
            quorumSet: this.quorumSet,
            quorumSetHashKey: this.quorumSetHashKey,
            geoData: this.geoData,
            statistics: this.statistics,
            dateDiscovered: this.dateDiscovered.toISOString(),
            dateUpdated: this.dateUpdated.toISOString(),
            isFullValidator: this.isFullValidator,
            isValidating: this.isValidating,
            isValidator: this.isValidator,
            index: this.index,
            homeDomain: this.homeDomain,
            organizationId: this.organizationId,
            historyUrl: this.historyUrl,
            alias: this.alias,
            isp: this.isp,
            historyArchiveHasError: this.historyArchiveHasError,
            connectivityError: this.connectivityError,
            stellarCoreVersionBehind: this.stellarCoreVersionBehind,
            lag: this.lag
        };
    }
    toString() {
        return `Node (key: ${this.key}, publicKey: ${this.publicKey})`;
    }
    static fromNodeV1DTO(nodeV1DTO) {
        const node = new Node(nodeV1DTO.publicKey);
        if (nodeV1DTO.geoData !== null)
            node.geoData = node_geo_data_1.NodeGeoData.fromNodeGeoDataV1(nodeV1DTO.geoData);
        if (nodeV1DTO.statistics !== null)
            node.statistics = node_statistics_1.NodeStatistics.fromNodeStatisticsV1(nodeV1DTO.statistics);
        if (nodeV1DTO.quorumSet !== null)
            node.quorumSet = quorum_set_1.QuorumSet.fromBaseQuorumSet(nodeV1DTO.quorumSet);
        PropertyMapper_1.default.mapProperties(nodeV1DTO, node, [
            'publicKey',
            'isValidator',
            'geoData',
            'quorumSet',
            'statistics',
            'dateDiscovered',
            'dateUpdated'
        ]);
        node.dateDiscovered = new Date(nodeV1DTO.dateDiscovered);
        node.dateUpdated = new Date(nodeV1DTO.dateUpdated);
        return node;
    }
}
exports.Node = Node;
