"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slot = void 0;
const shared_1 = require("shared");
const shared_2 = require("shared");
const extract_close_time_from_value_1 = require("./extract-close-time-from-value");
class Slot {
    logger;
    index;
    confirmedClosedLedger;
    valuesMap = new Map();
    localCloseTimeMap = new Map(); //we store the first time we observed a close time for a value
    //we can't wait until we validated the value, because slow nodes could influence this time.
    trustedQuorumSet;
    closeTime;
    localCloseTime;
    constructor(index, trustedQuorumSet, logger) {
        this.logger = logger;
        this.index = index;
        this.trustedQuorumSet = trustedQuorumSet;
    }
    getNodesAgreeingOnExternalizedValue() {
        if (this.confirmedClosedLedger === undefined)
            return new Set();
        const nodes = this.valuesMap.get(this.confirmedClosedLedger.value);
        if (!nodes)
            return new Set();
        return nodes;
    }
    getNodesDisagreeingOnExternalizedValue() {
        let nodes = new Set();
        if (this.confirmedClosedLedger === undefined)
            return nodes;
        Array.from(this.valuesMap.keys())
            .filter((value) => value !== this.confirmedClosedLedger?.value)
            .forEach((value) => {
            const otherNodes = this.valuesMap.get(value);
            if (otherNodes)
                nodes = new Set([...nodes, ...otherNodes]);
        });
        return nodes;
    }
    addExternalizeValue(nodeId, value, localCloseTime) {
        let nodesThatExternalizedValue = this.valuesMap.get(value);
        if (!nodesThatExternalizedValue) {
            nodesThatExternalizedValue = new Set();
            this.valuesMap.set(value, nodesThatExternalizedValue);
        }
        if (this.localCloseTimeMap.get(value) === undefined) {
            this.localCloseTimeMap.set(value, localCloseTime); //the first observed close time
        }
        if (nodesThatExternalizedValue.has(nodeId))
            //already recorded, no need to check if closed
            return;
        nodesThatExternalizedValue.add(nodeId);
        if (this.confirmedClosed())
            return;
        if (!shared_1.QuorumSet.getAllValidators(this.trustedQuorumSet).includes(nodeId)) {
            return;
        }
        this.logger.debug('Node part of trusted quorumSet, attempting slot close', {
            node: nodeId
        });
        if ((0, shared_2.containsSlice)(this.trustedQuorumSet, nodesThatExternalizedValue)) {
            //try to close slot
            this.confirmedClosedLedger = {
                sequence: this.index,
                value: value,
                closeTime: (0, extract_close_time_from_value_1.extractCloseTimeFromValue)(Buffer.from(value, 'base64')),
                localCloseTime: this.localCloseTimeMap.get(value)
            };
        }
    }
    getConfirmedClosedLedger() {
        return this.confirmedClosedLedger;
    }
    confirmedClosed() {
        return this.getConfirmedClosedLedger() !== undefined;
    }
}
exports.Slot = Slot;
