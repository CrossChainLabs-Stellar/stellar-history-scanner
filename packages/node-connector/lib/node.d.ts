import { Keypair } from '@stellar/stellar-base';
import { Connection } from './connection/connection';
import { ConnectionAuthentication } from './connection/connection-authentication';
import { NodeConfig } from './node-config';
import { EventEmitter } from 'events';
import { Server, Socket } from 'net';
import { pino } from 'pino';
export interface NodeInfo {
    ledgerVersion: number;
    overlayVersion: number;
    overlayMinVersion: number;
    versionString: string;
    networkId?: string;
}
/**
 * Supports two operations: connect to a node, and accept connections from other nodes.
 * In both cases it returns Connection instances that produce and consume StellarMessages
 */
export declare class Node extends EventEmitter {
    private config;
    keyPair: Keypair;
    private readonly connectionAuthentication;
    private readonly logger;
    protected server?: Server;
    constructor(config: NodeConfig, keyPair: Keypair, connectionAuthentication: ConnectionAuthentication, logger: pino.Logger);
    connectTo(ip: string, port: number): Connection;
    acceptIncomingConnections(port?: number, host?: string): void;
    stopAcceptingIncomingConnections(callback?: (err?: Error) => void): void;
    get listening(): boolean;
    protected onIncomingConnection(socket: Socket): void;
}
//# sourceMappingURL=node.d.ts.map