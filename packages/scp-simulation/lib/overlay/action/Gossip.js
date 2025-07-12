"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gossip = void 0;
const core_1 = require("../../core");
const federated_voting_1 = require("../../federated-voting");
class Gossip extends core_1.ProtocolAction {
    sender;
    payload;
    subType = 'Gossip';
    publicKey;
    neighborBlackList = [];
    constructor(sender, payload) {
        super();
        this.sender = sender;
        this.payload = payload;
        this.publicKey = sender;
    }
    execute(context) {
        return context.gossip(this.sender, this.payload, this.neighborBlackList);
    }
    blackListNeighbors(neighbors) {
        this.neighborBlackList = neighbors;
    }
    getBlackList() {
        return this.neighborBlackList.slice();
    }
    toString() {
        return `${this.sender} gossips message: "${this.payload}"`;
    }
    toJSON() {
        return {
            type: this.type,
            subType: this.subType,
            sender: this.sender,
            payload: this.payload.toJSON(),
            neighborBlackList: this.neighborBlackList,
            isDisrupted: this.isDisrupted
        };
    }
    static fromJSON(json) {
        const gossip = new Gossip(json.sender, federated_voting_1.Vote.fromJSON(json.payload));
        gossip.blackListNeighbors(json.neighborBlackList);
        gossip.isDisrupted = json.isDisrupted;
        return gossip;
    }
}
exports.Gossip = Gossip;
