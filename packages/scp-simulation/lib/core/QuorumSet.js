"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuorumSet = void 0;
class QuorumSet {
    threshold;
    validators;
    innerQuorumSets;
    //immutablity is importand for usage in votes!
    constructor(threshold, validators, innerQuorumSets) {
        this.threshold = threshold;
        this.validators = validators;
        this.innerQuorumSets = innerQuorumSets;
    }
    toJSON() {
        return {
            threshold: this.threshold,
            validators: this.validators,
            innerQuorumSets: this.innerQuorumSets.map((q) => q.toJSON())
        };
    }
    static fromJSON(json) {
        return new QuorumSet(json.threshold, json.validators, json.innerQuorumSets.map((q) => this.fromJSON(q)));
    }
}
exports.QuorumSet = QuorumSet;
