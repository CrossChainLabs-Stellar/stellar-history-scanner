"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryXDRProcessor = void 0;
const stream_1 = require("stream");
const Category_1 = require("../history-archive/Category");
class CategoryXDRProcessor extends stream_1.Writable {
    pool;
    url;
    category;
    categoryVerificationData;
    constructor(pool, url, category, categoryVerificationData) {
        super();
        this.pool = pool;
        this.url = url;
        this.category = category;
        this.categoryVerificationData = categoryVerificationData;
    }
    _write(xdr, encoding, callback) {
        if (this.pool.terminated) {
            //previous stream could still be transmitting
            callback(new Error('Workerpool terminated'));
            return;
        }
        switch (this.category) {
            case Category_1.Category.results: {
                this.performInPool(xdr, 'processTransactionHistoryResultEntryXDR')
                    .then((hashMap) => {
                    this.categoryVerificationData.calculatedTxSetResultHashes.set(hashMap.ledger, hashMap.hash);
                })
                    .catch((error) => {
                    console.log(this.url.value);
                    console.log(error);
                });
                break;
            }
            case Category_1.Category.transactions: {
                this.performInPool(xdr, 'processTransactionHistoryEntryXDR')
                    .then((hashMap) => {
                    this.categoryVerificationData.calculatedTxSetHashes.set(hashMap.ledger, hashMap.hash);
                })
                    .catch((error) => {
                    console.log(this.url.value);
                    console.log(error);
                });
                break;
            }
            case Category_1.Category.ledger: {
                this.performInPool(xdr, 'processLedgerHeaderHistoryEntryXDR')
                    .then((ledgerHeaderResult) => {
                    this.categoryVerificationData.expectedHashesPerLedger.set(ledgerHeaderResult.ledger, {
                        txSetResultHash: ledgerHeaderResult.transactionResultsHash,
                        txSetHash: ledgerHeaderResult.transactionsHash,
                        previousLedgerHeaderHash: ledgerHeaderResult.previousLedgerHeaderHash,
                        bucketListHash: ledgerHeaderResult.bucketListHash
                    });
                    this.categoryVerificationData.calculatedLedgerHeaderHashes.set(ledgerHeaderResult.ledger, ledgerHeaderResult.ledgerHeaderHash);
                    this.categoryVerificationData.protocolVersions.set(ledgerHeaderResult.ledger, ledgerHeaderResult.protocolVersion);
                })
                    .catch((error) => {
                    console.log(this.url.value);
                    console.log(error);
                });
                break;
            }
            default:
                break;
        }
        callback();
    }
    async performInPool(data, method) {
        return new Promise((resolve, reject) => {
            this.pool.workerpool
                .exec(method, [data])
                .then(function (map) {
                resolve(map);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    }
}
exports.CategoryXDRProcessor = CategoryXDRProcessor;
