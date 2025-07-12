"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voted = void 0;
const ProtocolEvent_1 = require("./ProtocolEvent");
class Voted extends ProtocolEvent_1.ProtocolEvent {
    publicKey;
    vote;
    subType = 'Voted';
    constructor(publicKey, vote) {
        super(publicKey);
        this.publicKey = publicKey;
        this.vote = vote;
    }
    toString() {
        return `${this.vote.toString()}`;
    }
}
exports.Voted = Voted;
