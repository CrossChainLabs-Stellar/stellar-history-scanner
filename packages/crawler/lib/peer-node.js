"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeerNode = void 0;
class PeerNode {
    ip;
    port;
    publicKey;
    nodeInfo;
    isValidating = false;
    isValidatingIncorrectValues = false;
    overLoaded = false;
    quorumSetHash;
    quorumSet;
    suppliedPeerList = false;
    latestActiveSlotIndex;
    participatingInSCP = false;
    successfullyConnected = false;
    externalizedValues = new Map();
    lagMSMeasurement = new Map();
    constructor(publicKey) {
        this.publicKey = publicKey;
    }
    get key() {
        return this.ip + ':' + this.port;
    }
    processConfirmedLedgerClose(closedLedger) {
        const externalized = this.externalizedValues.get(closedLedger.sequence);
        if (!externalized) {
            return;
        }
        if (externalized.value !== closedLedger.value) {
            this.isValidatingIncorrectValues = true;
            return;
        }
        this.isValidating = true;
        this.updateLag(closedLedger, externalized);
    }
    addExternalizedValue(slotIndex, localTime, value) {
        this.externalizedValues.set(slotIndex, {
            localTime: localTime,
            value: value
        });
    }
    updateLag(closedLedger, externalized) {
        this.lagMSMeasurement.set(closedLedger.sequence, this.determineLag(closedLedger.localCloseTime, externalized.localTime));
    }
    determineLag(localLedgerCloseTime, externalizeTime) {
        return externalizeTime.getTime() - localLedgerCloseTime.getTime();
    }
    getMinLagMS() {
        //implement without using spread operator
        let minLag;
        for (const lag of this.lagMSMeasurement.values()) {
            if (minLag === undefined || lag < minLag) {
                minLag = lag;
            }
        }
        return minLag;
    }
}
exports.PeerNode = PeerNode;
