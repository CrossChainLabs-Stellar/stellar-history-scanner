import { EventEmitter } from 'events';
import { Connection, Node as NetworkNode } from 'node-connector';
import { P } from 'pino';
import { StellarMessageWork } from 'node-connector';
import { NodeInfo } from 'node-connector';
type PublicKey = string;
type Address = string;
export interface ConnectedPayload {
    publicKey: PublicKey;
    ip: string;
    port: number;
    nodeInfo: NodeInfo;
}
export interface DataPayload {
    address: Address;
    stellarMessageWork: StellarMessageWork;
    publicKey: PublicKey;
}
export interface ClosePayload {
    address: string;
    publicKey?: PublicKey;
}
export declare class ConnectionManager extends EventEmitter {
    private node;
    private blackList;
    private logger;
    private activeConnections;
    constructor(node: NetworkNode, blackList: Set<PublicKey>, logger: P.Logger);
    /**
     * Connects to a node at the specified IP and port.
     * @param {string} ip The IP address of the node.
     * @param {number} port The port number of the node.
     */
    connectToNode(ip: string, port: number): void;
    private disconnect;
    disconnectByAddress(address: Address, error?: Error): void;
    getActiveConnection(address: Address): Connection | undefined;
    getActiveConnectionAddresses(): string[];
    hasActiveConnectionTo(address: Address): boolean;
    getNumberOfActiveConnections(): number;
    /**
     * Shuts down the connection manager, closing all active connections.
     */
    shutdown(): void;
}
export {};
//# sourceMappingURL=connection-manager.d.ts.map