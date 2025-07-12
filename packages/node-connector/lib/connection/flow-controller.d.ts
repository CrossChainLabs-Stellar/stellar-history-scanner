import { xdr } from '@stellar/stellar-base';
import MessageType = xdr.MessageType;
import StellarMessage = xdr.StellarMessage;
export declare class FlowController {
    private peerFloodReadingCapacity;
    private flowControlSendMoreBatchSize;
    private peerFloodReadingCapacityBytes;
    private flowControlSendMoreBatchSizeBytes;
    private messagesReceivedInCurrentBatch;
    private bytesReceivedInCurrentBatch;
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
    constructor(peerFloodReadingCapacity?: number, flowControlSendMoreBatchSize?: number, peerFloodReadingCapacityBytes?: number, flowControlSendMoreBatchSizeBytes?: number);
    start(): null | StellarMessage;
    sendMore(messageType: MessageType, stellarMessageSize: number): null | xdr.StellarMessage;
}
//# sourceMappingURL=flow-controller.d.ts.map