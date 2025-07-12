"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Broadcast = void 0;
const core_1 = require("../../../core");
const protocol_1 = require("../../protocol");
class Broadcast extends core_1.ProtocolAction {
    broadcaster;
    payload;
    neighborBlackList;
    subType = 'Broadcast';
    publicKey;
    constructor(broadcaster, payload, neighborBlackList = []) {
        super();
        this.broadcaster = broadcaster;
        this.payload = payload;
        this.neighborBlackList = neighborBlackList;
        this.publicKey = broadcaster;
    }
    execute(context) {
        return context.broadcast(this.broadcaster, this.payload, this.neighborBlackList);
    }
    blackListNeighbors(neighbors) {
        this.neighborBlackList = neighbors;
    }
    getBlackList() {
        return this.neighborBlackList.slice();
    }
    toString() {
        return `${this.payload.toString()}`;
    }
    toJSON() {
        return {
            type: this.type,
            subType: this.subType,
            broadcaster: this.broadcaster,
            payload: this.payload.toJSON(),
            neighborBlackList: this.neighborBlackList,
            isDisrupted: this.isDisrupted
        };
    }
    static fromJSON(json) {
        const neighborBlackList = Array.isArray(json.neighborBlackList)
            ? json.neighborBlackList
            : [];
        const broadcast = new Broadcast(json.broadcaster, protocol_1.Vote.fromJSON(json.payload), neighborBlackList);
        broadcast.isDisrupted = json.isDisrupted;
        return broadcast;
    }
}
exports.Broadcast = Broadcast;
