"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigFromEnv = getConfigFromEnv;
const stellar_base_1 = require("@stellar/stellar-base");
require('dotenv').config();
const yn_1 = __importDefault(require("yn"));
function getConfigFromEnv() {
    const ledgerVersion = getNumberFromEnv('LEDGER_VERSION', 17);
    const overlayVersion = getNumberFromEnv('OVERLAY_VERSION', 17);
    const overlayMinVersion = getNumberFromEnv('OVERLAY_MIN_VERSION', 16);
    const versionString = process.env['VERSION_STRING']
        ? process.env['VERSION_STRING']
        : 'sb';
    const listeningPort = getNumberFromEnv('LISTENING_PORT', 11625);
    const privateKey = process.env['PRIVATE_KEY']
        ? process.env['PRIVATE_KEY']
        : undefined;
    const receiveTransactionMessages = (0, yn_1.default)(process.env['RECEIVE_TRANSACTION_MSG']);
    const receiveSCPMessages = (0, yn_1.default)(process.env['RECEIVE_SCP_MSG']);
    const networkString = process.env['NETWORK']
        ? process.env['NETWORK']
        : stellar_base_1.Networks.PUBLIC;
    const peerFloodReadingCapacity = getNumberFromEnv('PEER_FLOOD_READING_CAPACITY', 200);
    const flowControlSendMoreBatchSize = getNumberFromEnv('FLOW_CONTROL_SEND_MORE_BATCH_SIZE', 40);
    const peerFloodReadingCapacityBytes = getNumberFromEnv('PEER_FLOOD_READING_CAPACITY_BYTES', 300000);
    const flowControlSendMoreBatchSizeBytes = getNumberFromEnv('FLOW_CONTROL_SEND_MORE_BATCH_SIZE_BYTES', 100000);
    return {
        network: networkString,
        nodeInfo: {
            ledgerVersion: ledgerVersion,
            overlayMinVersion: overlayMinVersion,
            overlayVersion: overlayVersion,
            versionString: versionString
        },
        listeningPort: listeningPort,
        privateKey: privateKey,
        receiveSCPMessages: receiveSCPMessages !== undefined ? receiveSCPMessages : true,
        receiveTransactionMessages: receiveTransactionMessages !== undefined
            ? receiveTransactionMessages
            : true,
        peerFloodReadingCapacity: peerFloodReadingCapacity,
        flowControlSendMoreBatchSize: flowControlSendMoreBatchSize,
        peerFloodReadingCapacityBytes: peerFloodReadingCapacityBytes,
        flowControlSendMoreBatchSizeBytes: flowControlSendMoreBatchSizeBytes
    };
}
function getNumberFromEnv(key, defaultValue) {
    let value = defaultValue;
    const stringy = process.env[key];
    if (stringy && !isNaN(parseInt(stringy))) {
        value = parseInt(stringy);
    }
    return value;
}
