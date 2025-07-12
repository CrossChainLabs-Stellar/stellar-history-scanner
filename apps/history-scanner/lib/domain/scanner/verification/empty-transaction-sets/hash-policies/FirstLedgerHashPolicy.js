"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirstLedgerHashPolicy = void 0;
require("reflect-metadata");
const CategoryScanner_1 = require("../../../CategoryScanner");
class FirstLedgerHashPolicy {
    calculateHash() {
        return CategoryScanner_1.CategoryScanner.ZeroHash;
    }
}
exports.FirstLedgerHashPolicy = FirstLedgerHashPolicy;
