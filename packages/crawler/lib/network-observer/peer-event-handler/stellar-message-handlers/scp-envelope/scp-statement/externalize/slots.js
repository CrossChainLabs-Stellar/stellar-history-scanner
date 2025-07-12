"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slots = void 0;
const slot_1 = require("./slot");
class Slots {
    logger;
    slots = new Map();
    trustedQuorumSet;
    constructor(trustedQuorumSet, logger) {
        this.logger = logger;
        this.trustedQuorumSet = trustedQuorumSet;
    }
    getSlot(slotIndex) {
        let slot = this.slots.get(slotIndex);
        if (!slot) {
            slot = new slot_1.Slot(slotIndex, this.trustedQuorumSet, this.logger);
            this.slots.set(slotIndex, slot);
        }
        return slot;
    }
    getConfirmedClosedSlotIndexes() {
        return Array.from(this.slots.values())
            .filter((slot) => slot.confirmedClosed())
            .map((slot) => slot.index);
    }
}
exports.Slots = Slots;
