"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const Vote_1 = require("./protocol/Vote");
class Message {
    sender;
    receiver;
    vote;
    constructor(sender, receiver, vote // in the future this should be an abstract payload with a hash function
    ) {
        this.sender = sender;
        this.receiver = receiver;
        this.vote = vote;
    }
    toString() {
        return `From: ${this.sender.toString()}, To: ${this.receiver.toString()}, ${this.vote.toString()}`;
    }
    toJSON() {
        return {
            sender: this.sender.toString(),
            receiver: this.receiver.toString(),
            vote: this.vote.toJSON()
        };
    }
    static fromJSON(json) {
        return new Message(json.sender, json.receiver, Vote_1.Vote.fromJSON(json.vote));
    }
}
exports.Message = Message;
