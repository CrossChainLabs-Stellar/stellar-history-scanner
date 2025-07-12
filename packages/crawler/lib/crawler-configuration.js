"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlerConfiguration = void 0;
class CrawlerConfiguration {
    nodeConfig;
    maxOpenConnections;
    maxCrawlTime;
    blackList;
    peerStraggleTimeoutMS;
    syncingTimeoutMS;
    quorumSetRequestTimeoutMS;
    consensusTimeoutMS;
    constructor(nodeConfig, //How many connections can be open at the same time. The higher the number, the faster the crawl
    maxOpenConnections = 25, //How many (non-top tier) peer connections can be open at the same time. The higher the number, the faster the crawl, but the more risk of higher latencies
    maxCrawlTime = 1800000, //max nr of ms the crawl will last. Safety guard in case crawler is stuck.
    blackList = new Set(), //nodes that are not crawled
    peerStraggleTimeoutMS = 10000, //time in ms that we listen to a node to determine if it is validating a confirmed closed ledger
    syncingTimeoutMS = 10000, //time in ms that the network observer waits for the top tiers to sync
    quorumSetRequestTimeoutMS = 1500, //time in ms that we wait for a quorum set to be received from a single peer
    consensusTimeoutMS = 90000 //time in ms before we declare the network stuck.
    ) {
        this.nodeConfig = nodeConfig;
        this.maxOpenConnections = maxOpenConnections;
        this.maxCrawlTime = maxCrawlTime;
        this.blackList = blackList;
        this.peerStraggleTimeoutMS = peerStraggleTimeoutMS;
        this.syncingTimeoutMS = syncingTimeoutMS;
        this.quorumSetRequestTimeoutMS = quorumSetRequestTimeoutMS;
        this.consensusTimeoutMS = consensusTimeoutMS;
    }
}
exports.CrawlerConfiguration = CrawlerConfiguration;
