"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crawl = exports.CrawlProcessState = void 0;
var CrawlProcessState;
(function (CrawlProcessState) {
    CrawlProcessState[CrawlProcessState["IDLE"] = 0] = "IDLE";
    CrawlProcessState[CrawlProcessState["TOP_TIER_SYNC"] = 1] = "TOP_TIER_SYNC";
    CrawlProcessState[CrawlProcessState["CRAWLING"] = 2] = "CRAWLING";
    CrawlProcessState[CrawlProcessState["STOPPING"] = 3] = "STOPPING";
})(CrawlProcessState || (exports.CrawlProcessState = CrawlProcessState = {}));
class Crawl {
    nodesToCrawl;
    observation;
    state = CrawlProcessState.IDLE;
    maxCrawlTimeHit = false;
    crawlQueueTaskDoneCallbacks = new Map();
    crawledNodeAddresses = new Set();
    failedConnections = [];
    peerAddressesReceivedDuringSync = [];
    constructor(nodesToCrawl, observation) {
        this.nodesToCrawl = nodesToCrawl;
        this.observation = observation;
    }
}
exports.Crawl = Crawl;
