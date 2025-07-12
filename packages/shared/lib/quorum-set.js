"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuorumSet = void 0;
class QuorumSet {
    threshold;
    validators;
    innerQuorumSets;
    constructor(threshold = Number.MAX_SAFE_INTEGER, validators = [], innerQuorumSets = []) {
        this.threshold = threshold;
        this.validators = validators;
        this.innerQuorumSets = innerQuorumSets;
    }
    hasValidators() {
        return this.validators.length > 0 || this.innerQuorumSets.length > 0;
    }
    static getAllValidators(qs) {
        return qs.innerQuorumSets.reduce((allValidators, innerQS) => allValidators.concat(QuorumSet.getAllValidators(innerQS)), qs.validators);
    }
    toJSON() {
        return {
            threshold: this.threshold,
            validators: Array.from(this.validators),
            innerQuorumSets: Array.from(this.innerQuorumSets)
        };
    }
    static fromBaseQuorumSet(quorumSetObject) {
        return new QuorumSet(quorumSetObject.threshold, quorumSetObject.validators, quorumSetObject.innerQuorumSets.map((innerQuorumSet) => this.fromBaseQuorumSet(innerQuorumSet)));
    }
}
exports.QuorumSet = QuorumSet;
