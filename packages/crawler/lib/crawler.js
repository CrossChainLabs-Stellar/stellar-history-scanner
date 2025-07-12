"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crawler = void 0;
const crawl_1 = require("./crawl");
const node_address_1 = require("./node-address");
/**
 * The crawler is the orchestrator of the crawling process.
 * It connects to nodes, delegates the handling of incoming messages to the StellarMessageHandler,
 * and manages the crawl state.
 */
class Crawler {
    config;
    crawlQueueManager;
    maxCrawlTimeManager;
    networkObserver;
    crawlLogger;
    logger;
    _crawl = null;
    constructor(config, crawlQueueManager, maxCrawlTimeManager, networkObserver, crawlLogger, logger) {
        this.config = config;
        this.crawlQueueManager = crawlQueueManager;
        this.maxCrawlTimeManager = maxCrawlTimeManager;
        this.networkObserver = networkObserver;
        this.crawlLogger = crawlLogger;
        this.logger = logger;
        this.logger = logger.child({ mod: 'Crawler' });
        this.setupPeerListenerEvents();
    }
    async startCrawl(crawl) {
        return new Promise((resolve, reject) => {
            if (this.isCrawlRunning()) {
                return reject(new Error('Crawl process already running'));
            }
            this.crawl = crawl;
            this.syncTopTierAndCrawl(resolve, reject);
        });
    }
    isCrawlRunning() {
        return this._crawl && this.crawl.state !== crawl_1.CrawlProcessState.IDLE;
    }
    setupPeerListenerEvents() {
        this.networkObserver.on('peers', (peers) => {
            this.onPeerAddressesReceived(peers);
        });
        this.networkObserver.on('disconnect', (data) => {
            this.crawlQueueManager.completeCrawlQueueTask(this.crawl.crawlQueueTaskDoneCallbacks, data.address);
            if (!data.publicKey) {
                this.crawl.failedConnections.push(data.address);
            }
        });
    }
    onPeerAddressesReceived(peerAddresses) {
        if (this.crawl.state === crawl_1.CrawlProcessState.TOP_TIER_SYNC) {
            this.crawl.peerAddressesReceivedDuringSync =
                this.crawl.peerAddressesReceivedDuringSync.concat(peerAddresses);
        }
        else {
            peerAddresses.forEach((peerAddress) => this.crawlPeerNode(peerAddress));
        }
    }
    async syncTopTierAndCrawl(resolve, reject) {
        const nrOfActiveTopTierConnections = await this.startTopTierSync();
        this.startCrawlProcess(resolve, reject, nrOfActiveTopTierConnections);
    }
    startCrawlProcess(resolve, reject, nrOfActiveTopTierConnections) {
        const nodesToCrawl = this.crawl.nodesToCrawl.concat(this.crawl.peerAddressesReceivedDuringSync);
        if (this.crawl.nodesToCrawl.length === 0 &&
            nrOfActiveTopTierConnections === 0) {
            this.logger.warn('No nodes to crawl and top tier connections closed, crawl failed');
            reject(new Error('No nodes to crawl and top tier connections failed'));
            return;
        }
        this.logger.info('Starting crawl process');
        this.crawlLogger.start(this.crawl);
        this.crawl.state = crawl_1.CrawlProcessState.CRAWLING;
        this.setupCrawlCompletionHandlers(resolve, reject);
        if (nodesToCrawl.length === 0) {
            this.logger.warn('No nodes to crawl');
            this.networkObserver.stop().then(() => {
                this.finish(resolve, reject);
                this.crawl.state = crawl_1.CrawlProcessState.STOPPING;
            });
        }
        else
            nodesToCrawl.forEach((address) => this.crawlPeerNode(address));
    }
    async startTopTierSync() {
        this.logger.info('Starting Top Tier sync');
        this.crawl.state = crawl_1.CrawlProcessState.TOP_TIER_SYNC;
        return this.networkObserver.startObservation(this.crawl.observation);
    }
    setupCrawlCompletionHandlers(resolve, reject) {
        this.startMaxCrawlTimeout(resolve, reject);
        this.crawlQueueManager.onDrain(() => {
            this.logger.info('Stopping crawl process');
            this.crawl.state = crawl_1.CrawlProcessState.STOPPING;
            this.networkObserver.stop().then(() => {
                this.finish(resolve, reject);
            });
        });
    }
    startMaxCrawlTimeout(resolve, reject) {
        this.maxCrawlTimeManager.setTimer(this.config.maxCrawlTime, () => {
            this.logger.fatal('Max crawl time hit, closing all connections');
            this.networkObserver.stop().then(() => this.finish(resolve, reject));
            this.crawl.maxCrawlTimeHit = true;
        });
    }
    finish(resolve, reject) {
        this.crawlLogger.stop();
        this.maxCrawlTimeManager.clearTimer();
        this.crawl.state = crawl_1.CrawlProcessState.IDLE;
        if (this.hasCrawlTimedOut()) {
            //todo clean crawl-queue and connections
            reject(new Error('Max crawl time hit, shutting down crawler'));
            return;
        }
        resolve(this.constructCrawlResult());
    }
    hasCrawlTimedOut() {
        return this.crawl.maxCrawlTimeHit;
    }
    constructCrawlResult() {
        return {
            peers: this.crawl.observation.peerNodes.getAll(),
            closedLedgers: this.crawl.observation.slots.getConfirmedClosedSlotIndexes(),
            latestClosedLedger: this.crawl.observation.latestConfirmedClosedLedger
        };
    }
    crawlPeerNode(nodeAddress) {
        const peerKey = (0, node_address_1.nodeAddressToPeerKey)(nodeAddress);
        if (!this.canNodeBeCrawled(peerKey))
            return;
        this.logNodeAddition(peerKey);
        this.crawl.crawledNodeAddresses.add(peerKey);
        const crawlTask = {
            nodeAddress: nodeAddress,
            crawl: this.crawl,
            connectCallback: () => this.networkObserver.connectToNode(nodeAddress[0], nodeAddress[1])
        };
        this.crawlQueueManager.addCrawlTask(crawlTask);
    }
    logNodeAddition(peerKey) {
        this.logger.debug({ peer: peerKey }, 'Adding address to crawl queue');
    }
    canNodeBeCrawled(peerKey) {
        return (!this.crawl.crawledNodeAddresses.has(peerKey) &&
            !this.crawl.observation.topTierAddressesSet.has(peerKey));
    }
    get crawl() {
        if (!this._crawl)
            throw new Error('crawl not set');
        return this._crawl;
    }
    set crawl(crawl) {
        this._crawl = crawl;
    }
}
exports.Crawler = Crawler;
