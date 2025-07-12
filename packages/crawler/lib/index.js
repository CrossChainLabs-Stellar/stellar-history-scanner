"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crawl = exports.CrawlFactory = exports.CrawlerConfiguration = exports.jsonStorage = exports.PeerNode = exports.Crawler = void 0;
exports.createLogger = createLogger;
exports.createCrawlFactory = createCrawlFactory;
exports.createCrawler = createCrawler;
const crawler_1 = require("./crawler");
const pino_1 = require("pino");
const node_connector_1 = require("node-connector");
const connection_manager_1 = require("./network-observer/connection-manager");
const crawl_queue_manager_1 = require("./crawl-queue-manager");
const crawl_queue_1 = require("./crawl-queue");
const max_crawl_time_manager_1 = require("./max-crawl-time-manager");
const crawl_logger_1 = require("./crawl-logger");
const network_observer_1 = require("./network-observer/network-observer");
const stellar_message_handler_1 = require("./network-observer/peer-event-handler/stellar-message-handlers/stellar-message-handler");
const timer_1 = require("./utilities/timer");
const externalize_statement_handler_1 = require("./network-observer/peer-event-handler/stellar-message-handlers/scp-envelope/scp-statement/externalize/externalize-statement-handler");
const scp_statement_handler_1 = require("./network-observer/peer-event-handler/stellar-message-handlers/scp-envelope/scp-statement/scp-statement-handler");
const scp_envelope_handler_1 = require("./network-observer/peer-event-handler/stellar-message-handlers/scp-envelope/scp-envelope-handler");
const quorum_set_manager_1 = require("./network-observer/quorum-set-manager");
const straggler_timer_1 = require("./network-observer/straggler-timer");
const on_peer_connected_1 = require("./network-observer/peer-event-handler/on-peer-connected");
const on_peer_connection_closed_1 = require("./network-observer/peer-event-handler/on-peer-connection-closed");
const on_peer_data_1 = require("./network-observer/peer-event-handler/on-peer-data");
const observation_manager_1 = require("./network-observer/observation-manager");
const peer_event_handler_1 = require("./network-observer/peer-event-handler/peer-event-handler");
const timers_1 = require("./utilities/timers");
const timer_factory_1 = require("./utilities/timer-factory");
const consensus_timer_1 = require("./network-observer/consensus-timer");
const observation_factory_1 = require("./network-observer/observation-factory");
const crawl_factory_1 = require("./crawl-factory");
var crawler_2 = require("./crawler");
Object.defineProperty(exports, "Crawler", { enumerable: true, get: function () { return crawler_2.Crawler; } });
var peer_node_1 = require("./peer-node");
Object.defineProperty(exports, "PeerNode", { enumerable: true, get: function () { return peer_node_1.PeerNode; } });
var json_storage_1 = require("./utilities/json-storage");
Object.defineProperty(exports, "jsonStorage", { enumerable: true, get: function () { return __importDefault(json_storage_1).default; } });
function createLogger() {
    return (0, pino_1.pino)({
        level: process.env.LOG_LEVEL || 'info',
        base: undefined
    });
}
function createCrawlFactory(config, logger) {
    if (!logger) {
        logger = createLogger();
    }
    return new crawl_factory_1.CrawlFactory(new observation_factory_1.ObservationFactory(), config.nodeConfig.network, logger);
}
function createCrawler(config, logger) {
    if (!logger) {
        logger = createLogger();
    }
    const node = (0, node_connector_1.createNode)(config.nodeConfig, logger);
    const connectionManager = new connection_manager_1.ConnectionManager(node, config.blackList, logger);
    const quorumSetManager = new quorum_set_manager_1.QuorumSetManager(connectionManager, config.quorumSetRequestTimeoutMS, logger);
    const crawlQueueManager = new crawl_queue_manager_1.CrawlQueueManager(new crawl_queue_1.AsyncCrawlQueue(config.maxOpenConnections), logger);
    const scpEnvelopeHandler = new scp_envelope_handler_1.ScpEnvelopeHandler(new scp_statement_handler_1.ScpStatementHandler(quorumSetManager, new externalize_statement_handler_1.ExternalizeStatementHandler(logger), logger));
    const stellarMessageHandler = new stellar_message_handler_1.StellarMessageHandler(scpEnvelopeHandler, quorumSetManager, logger);
    const timers = new timers_1.Timers(new timer_factory_1.TimerFactory());
    const stragglerTimer = new straggler_timer_1.StragglerTimer(connectionManager, timers, config.peerStraggleTimeoutMS, logger);
    const peerEventHandler = new peer_event_handler_1.PeerEventHandler(new on_peer_connected_1.OnPeerConnected(stragglerTimer, connectionManager, logger), new on_peer_connection_closed_1.OnPeerConnectionClosed(quorumSetManager, logger), new on_peer_data_1.OnPeerData(stellarMessageHandler, logger, connectionManager));
    const consensusTimer = new consensus_timer_1.ConsensusTimer(new timer_1.Timer(), config.consensusTimeoutMS);
    const networkObserverStateManager = new observation_manager_1.ObservationManager(connectionManager, consensusTimer, stragglerTimer, config.syncingTimeoutMS, logger);
    const peerNetworkManager = new network_observer_1.NetworkObserver(new observation_factory_1.ObservationFactory(), connectionManager, quorumSetManager, peerEventHandler, networkObserverStateManager);
    return new crawler_1.Crawler(config, crawlQueueManager, new max_crawl_time_manager_1.MaxCrawlTimeManager(), peerNetworkManager, new crawl_logger_1.CrawlLogger(connectionManager, crawlQueueManager, logger), logger);
}
var crawler_configuration_1 = require("./crawler-configuration");
Object.defineProperty(exports, "CrawlerConfiguration", { enumerable: true, get: function () { return crawler_configuration_1.CrawlerConfiguration; } });
var crawl_factory_2 = require("./crawl-factory");
Object.defineProperty(exports, "CrawlFactory", { enumerable: true, get: function () { return crawl_factory_2.CrawlFactory; } });
var crawl_1 = require("./crawl");
Object.defineProperty(exports, "Crawl", { enumerable: true, get: function () { return crawl_1.Crawl; } });
