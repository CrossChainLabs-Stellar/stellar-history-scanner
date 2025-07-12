"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlLogger = void 0;
const truncate_1 = require("./utilities/truncate");
class CrawlLogger {
    connectionManager;
    crawlQueueManager;
    logger;
    loggingTimer;
    _crawl;
    constructor(connectionManager, crawlQueueManager, logger) {
        this.connectionManager = connectionManager;
        this.crawlQueueManager = crawlQueueManager;
        this.logger = logger;
    }
    get crawl() {
        if (!this._crawl) {
            throw new Error('Crawl not set');
        }
        return this._crawl;
    }
    start(crawl) {
        console.time('crawl');
        this._crawl = crawl;
        this.logger.info('Starting crawl with seed of ' + crawl.nodesToCrawl.length + 'addresses.');
        this.loggingTimer = setInterval(() => {
            this.logger.info({
                queueLength: this.crawlQueueManager.queueLength(),
                activeConnections: this.connectionManager.getNumberOfActiveConnections(),
                activeTopTiers: this.connectionManager
                    .getActiveConnectionAddresses()
                    .filter((address) => crawl.observation.topTierAddressesSet.has(address)).length
            });
        }, 5000);
    }
    stop() {
        this.logger.info('Crawl process complete');
        console.timeEnd('crawl');
        clearInterval(this.loggingTimer);
        this.logCrawlState();
        this.logger.info('crawl finished');
    }
    logCrawlState() {
        this.logger.debug({ peers: this.crawl.failedConnections }, 'Failed connections');
        this.crawl.observation.peerNodes.getAll().forEach((peer) => {
            this.logger.info({
                ip: peer.key,
                pk: (0, truncate_1.truncate)(peer.publicKey),
                connected: peer.successfullyConnected,
                scp: peer.participatingInSCP,
                validating: peer.isValidating,
                overLoaded: peer.overLoaded,
                lagMS: peer.getMinLagMS(),
                incorrect: peer.isValidatingIncorrectValues
            });
        });
        this.logger.info('Connection attempts: ' + this.crawl.crawledNodeAddresses.size);
        this.logger.info('Detected public keys: ' + this.crawl.observation.peerNodes.size);
        this.logger.info('Successful connections: ' +
            Array.from(this.crawl.observation.peerNodes.getAll().values()).filter((peer) => peer.successfullyConnected).length);
        this.logger.info('Validating nodes: ' +
            Array.from(this.crawl.observation.peerNodes.values()).filter((node) => node.isValidating).length);
        this.logger.info('Overloaded nodes: ' +
            Array.from(this.crawl.observation.peerNodes.values()).filter((node) => node.overLoaded).length);
        this.logger.info(Array.from(this.crawl.observation.peerNodes.values()).filter((node) => node.suppliedPeerList).length + ' supplied us with a peers list.');
        this.logger.info('Closed ledgers: ' +
            this.crawl.observation.slots.getConfirmedClosedSlotIndexes().length);
        const slowNodes = Array.from(this.crawl.observation.peerNodes.values()).filter((node) => (node.getMinLagMS() ?? 0) > 2000);
        this.logger.info('Slow nodes: ' +
            slowNodes.length +
            ' ' +
            slowNodes
                .map((node) => (0, truncate_1.truncate)(node.publicKey) + ':' + node.getMinLagMS())
                .join(', '));
    }
}
exports.CrawlLogger = CrawlLogger;
