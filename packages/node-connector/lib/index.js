"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuorumSetFromMessage = exports.verifySCPEnvelopeSignature = exports.getIpFromPeerAddress = exports.createStatementXDRSignature = exports.createSCPEnvelopeSignature = exports.getPublicKeyStringFromBuffer = exports.ScpReader = exports.getConfigFromEnv = exports.SCPStatement = exports.StellarMessageRouter = exports.UniqueSCPStatementTransform = exports.Connection = exports.Node = void 0;
exports.createNode = createNode;
const node_1 = require("./node");
const stellar_base_1 = require("@stellar/stellar-base");
const connection_authentication_1 = require("./connection/connection-authentication");
const pino_1 = require("pino");
var node_2 = require("./node");
Object.defineProperty(exports, "Node", { enumerable: true, get: function () { return node_2.Node; } });
var connection_1 = require("./connection/connection");
Object.defineProperty(exports, "Connection", { enumerable: true, get: function () { return connection_1.Connection; } });
var unique_scp_statement_transform_1 = require("./unique-scp-statement-transform");
Object.defineProperty(exports, "UniqueSCPStatementTransform", { enumerable: true, get: function () { return unique_scp_statement_transform_1.UniqueSCPStatementTransform; } });
var stellar_message_router_1 = require("./stellar-message-router");
Object.defineProperty(exports, "StellarMessageRouter", { enumerable: true, get: function () { return stellar_message_router_1.StellarMessageRouter; } });
var scp_statement_dto_1 = require("./scp-statement-dto");
Object.defineProperty(exports, "SCPStatement", { enumerable: true, get: function () { return scp_statement_dto_1.SCPStatement; } });
var node_config_1 = require("./node-config");
Object.defineProperty(exports, "getConfigFromEnv", { enumerable: true, get: function () { return node_config_1.getConfigFromEnv; } });
var scp_reader_1 = require("./scp-reader");
Object.defineProperty(exports, "ScpReader", { enumerable: true, get: function () { return scp_reader_1.ScpReader; } });
var stellar_message_service_1 = require("./stellar-message-service"); //todo: separate package?
Object.defineProperty(exports, "getPublicKeyStringFromBuffer", { enumerable: true, get: function () { return stellar_message_service_1.getPublicKeyStringFromBuffer; } });
Object.defineProperty(exports, "createSCPEnvelopeSignature", { enumerable: true, get: function () { return stellar_message_service_1.createSCPEnvelopeSignature; } });
Object.defineProperty(exports, "createStatementXDRSignature", { enumerable: true, get: function () { return stellar_message_service_1.createStatementXDRSignature; } });
Object.defineProperty(exports, "getIpFromPeerAddress", { enumerable: true, get: function () { return stellar_message_service_1.getIpFromPeerAddress; } });
Object.defineProperty(exports, "verifySCPEnvelopeSignature", { enumerable: true, get: function () { return stellar_message_service_1.verifySCPEnvelopeSignature; } });
Object.defineProperty(exports, "getQuorumSetFromMessage", { enumerable: true, get: function () { return stellar_message_service_1.getQuorumSetFromMessage; } });
function createNode(config, logger) {
    if (!logger) {
        logger = (0, pino_1.pino)({
            level: process.env.LOG_LEVEL || 'info',
            base: undefined
        });
    }
    logger = logger.child({ app: 'Connector' });
    if (!stellar_base_1.FastSigning) {
        logger.debug('warning', 'FastSigning not enabled');
    }
    let keyPair;
    if (config.privateKey) {
        try {
            keyPair = stellar_base_1.Keypair.fromSecret(config.privateKey);
        }
        catch (error) {
            throw new Error('Invalid private key');
        }
    }
    else {
        keyPair = stellar_base_1.Keypair.random();
    }
    const networkId = (0, stellar_base_1.hash)(Buffer.from(config.network));
    const connectionAuthentication = new connection_authentication_1.ConnectionAuthentication(keyPair, networkId);
    return new node_1.Node(config, keyPair, connectionAuthentication, logger);
}
