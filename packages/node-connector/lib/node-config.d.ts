import { NodeInfo } from './node';
export interface NodeConfig {
    network: string;
    nodeInfo: NodeInfo;
    listeningPort: number;
    privateKey?: string;
    receiveTransactionMessages: boolean;
    receiveSCPMessages: boolean;
    peerFloodReadingCapacity: number;
    flowControlSendMoreBatchSize: number;
    peerFloodReadingCapacityBytes: number;
    flowControlSendMoreBatchSizeBytes: number;
}
export declare function getConfigFromEnv(): NodeConfig;
//# sourceMappingURL=node-config.d.ts.map