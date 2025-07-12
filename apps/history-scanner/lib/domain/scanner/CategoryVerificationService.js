"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CategoryVerificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryVerificationService = void 0;
const CategoryScanner_1 = require("./CategoryScanner");
const Category_1 = require("../history-archive/Category");
const neverthrow_1 = require("neverthrow");
const inversify_1 = require("inversify");
const EmptyTransactionSetsHashVerifier_1 = require("./verification/empty-transaction-sets/EmptyTransactionSetsHashVerifier");
const getLowestNumber_1 = require("./getLowestNumber");
let CategoryVerificationService = CategoryVerificationService_1 = class CategoryVerificationService {
    verify(categoryVerificationData, bucketListHashes, checkPointFrequency, initialPreviousLedgerHeader //bootstrapped from a previous run
    ) {
        const lowestLedger = CategoryVerificationService_1.getLowestLedger(categoryVerificationData);
        for (const [ledger, expectedHashes] of categoryVerificationData.expectedHashesPerLedger) {
            const result = this.verifyLedgerData(ledger, lowestLedger, categoryVerificationData, expectedHashes, bucketListHashes, checkPointFrequency, initialPreviousLedgerHeader);
            if (result.isErr())
                return result;
        }
        return (0, neverthrow_1.ok)(undefined);
    }
    verifyLedgerData(ledger, lowestLedger, categoryVerificationData, expectedHashes, bucketListHashes, checkPointFrequency, initialPreviousLedgerHeader) {
        if (!this.verifyTransactions(ledger, categoryVerificationData, expectedHashes)) {
            return (0, neverthrow_1.err)({
                ledger: ledger,
                category: Category_1.Category.transactions,
                message: 'Wrong transaction hash'
            });
        }
        if (!this.verifyTransactionResults(ledger, categoryVerificationData, expectedHashes)) {
            return (0, neverthrow_1.err)({
                ledger: ledger,
                category: Category_1.Category.results,
                message: 'Wrong results hash'
            });
        }
        if (!this.verifyLedgerHeaders(ledger, categoryVerificationData, expectedHashes, lowestLedger, initialPreviousLedgerHeader))
            return (0, neverthrow_1.err)({
                ledger: ledger,
                category: Category_1.Category.ledger,
                message: 'Wrong ledger hash'
            });
        if (!this.verifyBucketListHash(ledger, checkPointFrequency, expectedHashes, bucketListHashes)) {
            if (expectedHashes.bucketListHash !== bucketListHashes.get(ledger)) {
                return (0, neverthrow_1.err)({
                    ledger: ledger,
                    category: Category_1.Category.ledger,
                    message: 'Wrong bucket list hash'
                });
            }
        }
        return (0, neverthrow_1.ok)(undefined);
    }
    static getLowestLedger(categoryVerificationData) {
        return (0, getLowestNumber_1.getLowestNumber)(Array.from(categoryVerificationData.expectedHashesPerLedger.keys()));
    }
    verifyTransactionResults(ledger, categoryVerificationData, expectedHashes) {
        let calculatedTxSetResultHash = categoryVerificationData.calculatedTxSetResultHashes.get(ledger);
        if (!calculatedTxSetResultHash) {
            if (ledger > 1)
                calculatedTxSetResultHash = CategoryScanner_1.CategoryScanner.ZeroXdrHash;
            else
                calculatedTxSetResultHash = CategoryScanner_1.CategoryScanner.ZeroHash;
        }
        return expectedHashes.txSetResultHash === calculatedTxSetResultHash;
    }
    verifyBucketListHash(ledger, checkPointFrequency, expectedHashes, bucketListHashes) {
        if ((ledger + 1) % checkPointFrequency.get() === 0) {
            return expectedHashes.bucketListHash === bucketListHashes.get(ledger);
        }
        return true;
    }
    verifyLedgerHeaders(ledger, categoryVerificationData, expectedHashes, lowestLedger, initialPreviousLedgerHeader) {
        const calculatedPreviousLedgerHash = categoryVerificationData.calculatedLedgerHeaderHashes.get(ledger - 1);
        if (expectedHashes.previousLedgerHeaderHash === calculatedPreviousLedgerHash) {
            return true;
        }
        if (initialPreviousLedgerHeader &&
            ledger - 1 === initialPreviousLedgerHeader.ledger &&
            initialPreviousLedgerHeader.hash ===
                expectedHashes.previousLedgerHeaderHash) {
            return true;
        }
        if (ledger === lowestLedger && !initialPreviousLedgerHeader) {
            return true;
        }
        return false;
    }
    verifyTransactions(ledger, categoryVerificationData, expectedHashes) {
        const calculatedTxSetHash = categoryVerificationData.calculatedTxSetHashes.get(ledger);
        const protocolVersion = categoryVerificationData.protocolVersions.get(ledger) ?? 0;
        if (!calculatedTxSetHash) {
            const matched = EmptyTransactionSetsHashVerifier_1.EmptyTransactionSetsHashVerifier.verify(ledger, protocolVersion, expectedHashes.previousLedgerHeaderHash, expectedHashes.txSetHash);
            if (matched.isErr())
                return false;
            else
                return matched.value;
        }
        return calculatedTxSetHash === expectedHashes.txSetHash;
    }
};
exports.CategoryVerificationService = CategoryVerificationService;
exports.CategoryVerificationService = CategoryVerificationService = CategoryVerificationService_1 = __decorate([
    (0, inversify_1.injectable)()
], CategoryVerificationService);
