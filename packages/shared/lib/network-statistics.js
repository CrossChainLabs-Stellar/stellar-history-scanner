"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PropertyMapper_1 = __importDefault(require("./PropertyMapper"));
class NetworkStatistics {
    time = new Date();
    nrOfActiveWatchers = 0; //@deprectated
    nrOfConnectableNodes = 0;
    nrOfActiveValidators = 0; //validators that are validating
    nrOfActiveFullValidators = 0;
    nrOfActiveOrganizations = 0;
    transitiveQuorumSetSize = 0;
    hasTransitiveQuorumSet = false;
    hasQuorumIntersection;
    minBlockingSetSize;
    minBlockingSetFilteredSize = 0;
    minBlockingSetOrgsSize;
    minBlockingSetOrgsFilteredSize;
    minBlockingSetCountrySize;
    minBlockingSetCountryFilteredSize;
    minBlockingSetISPSize;
    minBlockingSetISPFilteredSize;
    minSplittingSetSize;
    minSplittingSetOrgsSize;
    minSplittingSetCountrySize;
    minSplittingSetISPSize;
    topTierSize;
    topTierOrgsSize;
    hasSymmetricTopTier = false;
    static fromJSON(networkStatsObject) {
        const networkStatistics = new NetworkStatistics();
        PropertyMapper_1.default.mapProperties(networkStatsObject, networkStatistics, [
            'time'
        ]);
        networkStatistics.time = new Date(networkStatsObject.time);
        return networkStatistics;
    }
}
exports.default = NetworkStatistics;
