"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vote = void 0;
const core_1 = require("../../core");
//contains the statement a node voted from and if it accepted a vote.
class Vote {
    statement;
    isVoteToAccept;
    publicKey;
    quorumSet;
    constructor(statement, // I voted for statement
    isVoteToAccept, //If false: I voted for the statement, else: an intact node voted for the statement
    publicKey, quorumSet) {
        this.statement = statement;
        this.isVoteToAccept = isVoteToAccept;
        this.publicKey = publicKey;
        this.quorumSet = quorumSet;
    }
    toString() {
        if (!this.isVoteToAccept)
            return `${this.publicKey}:vote(${this.statement})`;
        else
            return `${this.publicKey}:vote(accept(${this.statement}))`;
    }
    hash() {
        return `${this.publicKey.toString()}${this.statement.toString()}${this.isVoteToAccept}${this.quorumSet.toJSON()}`;
    }
    toJSON() {
        return {
            statement: this.statement,
            isVoteToAccept: this.isVoteToAccept,
            publicKey: this.publicKey,
            quorumSet: this.quorumSet.toJSON()
        };
    }
    static fromJSON(json) {
        return new Vote(json.statement, json.isVoteToAccept, json.publicKey, core_1.QuorumSet.fromJSON(json.quorumSet));
    }
}
exports.Vote = Vote;
