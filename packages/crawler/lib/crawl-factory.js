"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlFactory = void 0;
const crawl_1 = require("./crawl");
const slots_1 = require("./network-observer/peer-event-handler/stellar-message-handlers/scp-envelope/scp-statement/externalize/slots");
const peer_node_collection_1 = require("./peer-node-collection");
class CrawlFactory {
    observationFactory;
    network;
    logger;
    constructor(observationFactory, network, logger) {
        this.observationFactory = observationFactory;
        this.network = network;
        this.logger = logger;
    }
    createCrawl(nodesToCrawl, topTierAddresses, topTierQuorumSet, latestConfirmedClosedLedger, quorumSets) {
        const observation = this.observationFactory.createObservation(this.network, new slots_1.Slots(topTierQuorumSet, this.logger), topTierAddresses, new peer_node_collection_1.PeerNodeCollection(), latestConfirmedClosedLedger, quorumSets);
        return new crawl_1.Crawl(nodesToCrawl, observation);
    }
}
exports.CrawlFactory = CrawlFactory;
