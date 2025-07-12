"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTransactionHistoryEntryXDR = exports.processTransactionHistoryResultEntryXDR = exports.processLedgerHeaderHistoryEntryXDR = void 0;
const workerpool = __importStar(require("workerpool"));
const zlib_1 = require("zlib");
const crypto_1 = require("crypto");
const worker_threads_1 = require("worker_threads");
const stellar_base_1 = require("@stellar/stellar-base");
const hasher = __importStar(require("@stellarbeat/stellar-history-archive-hasher"));
async function unzipAndHash(zip) {
    return new Promise((resolve, reject) => {
        (0, zlib_1.gunzip)(zip, (error, unzipped) => {
            if (error)
                reject(error);
            else {
                const hashSum = (0, crypto_1.createHash)('sha256');
                hashSum.update(unzipped);
                resolve(hashSum.digest('hex'));
            }
        });
    });
}
function processLedgerHeaderHistoryEntryXDR(ledgerHeaderHistoryEntryXDR) {
    const ledgerHeaderHistoryEntry = stellar_base_1.xdr.LedgerHeaderHistoryEntry.fromXDR(Buffer.from(ledgerHeaderHistoryEntryXDR));
    return {
        ledger: ledgerHeaderHistoryEntry.header().ledgerSeq(),
        transactionResultsHash: ledgerHeaderHistoryEntry
            .header()
            .txSetResultHash()
            .toString('base64'),
        transactionsHash: ledgerHeaderHistoryEntry
            .header()
            .scpValue()
            .txSetHash()
            .toString('base64'),
        previousLedgerHeaderHash: ledgerHeaderHistoryEntry
            .header()
            .previousLedgerHash()
            .toString('base64'),
        ledgerHeaderHash: ledgerHeaderHistoryEntry.hash().toString('base64'),
        bucketListHash: ledgerHeaderHistoryEntry
            .header()
            .bucketListHash()
            .toString('base64'),
        protocolVersion: ledgerHeaderHistoryEntry.header().ledgerVersion()
    };
}
exports.processLedgerHeaderHistoryEntryXDR = processLedgerHeaderHistoryEntryXDR;
function processTransactionHistoryResultEntryXDR(transactionHistoryResultXDR) {
    const hash = hasher.hash_transaction_history_result_entry(transactionHistoryResultXDR);
    return {
        ledger: Buffer.from(transactionHistoryResultXDR).readInt32BE(),
        hash: Buffer.from(hash).toString('base64')
    };
}
exports.processTransactionHistoryResultEntryXDR = processTransactionHistoryResultEntryXDR;
function processTransactionHistoryEntryXDR(transactionHistoryEntryXDR) {
    const hash = hasher.hash_transaction_history_entry(transactionHistoryEntryXDR);
    return {
        ledger: Buffer.from(transactionHistoryEntryXDR).readInt32BE(),
        hash: Buffer.from(hash).toString('base64')
    };
}
exports.processTransactionHistoryEntryXDR = processTransactionHistoryEntryXDR;
//weird behaviour, di loads this worker file without referencing it
if (!worker_threads_1.isMainThread) {
    workerpool.worker({
        unzipAndHash: unzipAndHash,
        processTransactionHistoryResultEntryXDR: processTransactionHistoryResultEntryXDR,
        processTransactionHistoryEntryXDR: processTransactionHistoryEntryXDR,
        processLedgerHeaderHistoryEntryXDR: processLedgerHeaderHistoryEntryXDR
    });
}
