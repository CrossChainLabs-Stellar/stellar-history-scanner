"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowController = void 0;
const stellar_base_1 = require("@stellar/stellar-base");
const is_flood_message_1 = require("./is-flood-message");
class FlowController {
    peerFloodReadingCapacity;
    flowControlSendMoreBatchSize;
    peerFloodReadingCapacityBytes;
    flowControlSendMoreBatchSizeBytes;
    messagesReceivedInCurrentBatch = 0;
    bytesReceivedInCurrentBatch = 0;
    /**
     * Uses param names from stellar-core config. Non bytes parameters are counted in number of messages.
     * The Reading capacity is the number of messages that can be processed simultaneously.
     * Everytime a batch of messages is processed, we request the capacity back through sendmore messages.
     * The bytes capacity should be higher than the batch size + the maximum message size, to avoid getting stuck.
     * @param peerFloodReadingCapacity
     * @param flowControlSendMoreBatchSize
     * @param peerFloodReadingCapacityBytes
     * @param flowControlSendMoreBatchSizeBytes
     */
    constructor(
    //we use stellar-core defaults atm
    peerFloodReadingCapacity = 200, flowControlSendMoreBatchSize = 40, peerFloodReadingCapacityBytes = 300000, flowControlSendMoreBatchSizeBytes = 100000) {
        this.peerFloodReadingCapacity = peerFloodReadingCapacity;
        this.flowControlSendMoreBatchSize = flowControlSendMoreBatchSize;
        this.peerFloodReadingCapacityBytes = peerFloodReadingCapacityBytes;
        this.flowControlSendMoreBatchSizeBytes = flowControlSendMoreBatchSizeBytes;
    }
    /*
     * Start by sending a send-more message with the _total_ capacity available.
     */
    start() {
        return stellar_base_1.xdr.StellarMessage.sendMoreExtended(new stellar_base_1.xdr.SendMoreExtended({
            numMessages: this.peerFloodReadingCapacity,
            numBytes: this.peerFloodReadingCapacityBytes
        }));
    }
    sendMore(messageType, stellarMessageSize) {
        if ((0, is_flood_message_1.isFloodMessage)(messageType)) {
            this.messagesReceivedInCurrentBatch++;
            this.bytesReceivedInCurrentBatch += stellarMessageSize;
        }
        let shouldSendMore = this.messagesReceivedInCurrentBatch === this.flowControlSendMoreBatchSize;
        shouldSendMore =
            shouldSendMore ||
                this.bytesReceivedInCurrentBatch >=
                    this.flowControlSendMoreBatchSizeBytes;
        //reclaim the capacity
        let sendMoreMessage;
        if (shouldSendMore) {
            sendMoreMessage = stellar_base_1.xdr.StellarMessage.sendMoreExtended(new stellar_base_1.xdr.SendMoreExtended({
                numMessages: this.messagesReceivedInCurrentBatch, //!request back the number of messages we received, not the total capacity like when starting!
                numBytes: this.bytesReceivedInCurrentBatch
            }));
            this.messagesReceivedInCurrentBatch = 0;
            this.bytesReceivedInCurrentBatch = 0;
            return sendMoreMessage;
        }
        return null;
    }
}
exports.FlowController = FlowController;
