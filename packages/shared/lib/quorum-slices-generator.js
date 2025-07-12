"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuorumSlicesGenerator = void 0;
const index_1 = require("./index");
class QuorumSlicesGenerator {
    getSlices(quorumSet) {
        if (quorumSet.threshold >
            quorumSet.validators.length + quorumSet.innerQuorumSets.length) {
            return [];
        }
        if (quorumSet.threshold === 0) {
            return [];
        }
        return this.getCombinationsOfSizeK(quorumSet.threshold, [].concat(quorumSet.validators).concat(quorumSet.innerQuorumSets));
    }
    getCombinationsOfSizeK(k, nodesOrQSets) {
        const combinations = [];
        for (let i = 0; i < nodesOrQSets.length; i++) {
            let prefixes = [];
            if (nodesOrQSets[i] instanceof index_1.QuorumSet) {
                prefixes = this.getSlices(nodesOrQSets[i]);
            }
            else {
                prefixes = [[nodesOrQSets[i]]];
            }
            if (k === 1) {
                prefixes.forEach((prefix) => combinations.push(prefix));
            }
            else if (k - 1 <= nodesOrQSets.length - i - 1) {
                //not enough candidates left
                const postCombinations = this.getCombinationsOfSizeK(k - 1, nodesOrQSets.slice(i + 1, nodesOrQSets.length));
                prefixes.forEach((prefix) => postCombinations.forEach((postCombination) => combinations.push(prefix.concat(postCombination))));
            }
        }
        return combinations;
    }
}
exports.QuorumSlicesGenerator = QuorumSlicesGenerator;
