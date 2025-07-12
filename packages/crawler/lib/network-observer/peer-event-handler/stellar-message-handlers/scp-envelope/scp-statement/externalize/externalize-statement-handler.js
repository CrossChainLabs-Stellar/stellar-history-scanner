"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalizeStatementHandler = void 0;
const assert = __importStar(require("assert"));
//attempts slot close confirmation and updates peer statuses accordingly
class ExternalizeStatementHandler {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    //returns ledger if slot is closed
    handle(peerNodes, slot, externalizeData, localCloseTime, latestConfirmedClosedLedger) {
        assert.equal(slot.index, externalizeData.slotIndex, 'Slot index mismatch');
        this.logExternalizeMessage(externalizeData.publicKey, slot.index, externalizeData.value);
        peerNodes.addExternalizedValueForPeerNode(externalizeData.publicKey, slot.index, externalizeData.value, localCloseTime);
        const closedLedger = slot.getConfirmedClosedLedger();
        if (closedLedger) {
            peerNodes.confirmLedgerCloseForNode(externalizeData.publicKey, closedLedger);
            return null;
        }
        //don't confirm older slots as this could mess with the lag detection
        //because nodes could relay/replay old externalize messages
        if (externalizeData.slotIndex <= latestConfirmedClosedLedger.sequence)
            return null;
        const confirmedClosedSlotOrNull = this.attemptSlotCloseConfirmation(slot, externalizeData.publicKey, externalizeData.value);
        if (confirmedClosedSlotOrNull === null)
            return null;
        this.confirmLedgerCloseForPeersThatHaveExternalized(confirmedClosedSlotOrNull, slot, peerNodes);
        return confirmedClosedSlotOrNull;
    }
    attemptSlotCloseConfirmation(slot, publicKey, value) {
        slot.addExternalizeValue(publicKey, value, new Date());
        const closedLedger = slot.getConfirmedClosedLedger();
        if (!closedLedger)
            return null;
        return closedLedger;
    }
    confirmLedgerCloseForPeersThatHaveExternalized(closedLedger, slot, peers) {
        this.logLedgerClose(closedLedger);
        peers.confirmLedgerCloseForValidatingNodes(slot.getNodesAgreeingOnExternalizedValue(), closedLedger);
        peers.confirmLedgerCloseForDisagreeingNodes(slot.getNodesDisagreeingOnExternalizedValue());
    }
    logExternalizeMessage(publicKey, slotIndex, value) {
        this.logger.debug({
            publicKey: publicKey,
            slotIndex: slotIndex.toString(),
            value: value
        }, 'Processing externalize msg');
    }
    logLedgerClose(closedLedger) {
        this.logger.info({
            sequence: closedLedger.sequence,
            closeTime: closedLedger.closeTime,
            localCloseTime: closedLedger.localCloseTime
        }, 'Ledger closed!');
    }
}
exports.ExternalizeStatementHandler = ExternalizeStatementHandler;
