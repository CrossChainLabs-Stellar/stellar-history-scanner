import { Keypair, xdr } from '@stellar/stellar-base';
import { Result } from 'neverthrow';
import { Socket } from 'net';
import { ConnectionAuthentication } from './connection-authentication';
import { Duplex } from 'stream';
import { AuthenticatedMessageV0 } from './xdr-message-handler';
import * as P from 'pino';
import { NodeInfo } from '../node';
import { FlowController } from './flow-controller';
import StellarMessage = xdr.StellarMessage;
import MessageType = xdr.MessageType;
type PublicKey = string;
declare enum ReadState {
    ReadyForLength = 0,
    ReadyForMessage = 1,
    Blocked = 2
}
declare enum HandshakeState {
    CONNECTING = 0,
    CONNECTED = 1,
    GOT_HELLO = 2,
    COMPLETED = 3
}
export interface ConnectionOptions {
    ip: string;
    port: number;
    keyPair: Keypair;
    localNodeInfo: NodeInfo;
    listeningPort?: number;
    remoteCalledUs: boolean;
    receiveTransactionMessages: boolean;
    receiveSCPMessages: boolean;
}
export interface StellarMessageWork {
    stellarMessage: StellarMessage;
    done: () => void;
}
/**
 * Duplex stream that wraps a tcp socket and handles the handshake to a stellar core node and all authentication verification of overlay messages. It encapsulates incoming and outgoing connections to and from stellar nodes.
 *
 * https://github.com/stellar/stellar-core/blob/9c3e67776449ae249aa811e99cbd6eee202bd2b6/src/xdr/Stellar-overlay.x#L219
 * It returns xdr.StellarMessages to the consumer.
 * It accepts xdr.StellarMessages when handshake is completed and wraps them in a correct AuthenticatedMessage before sending
 *
 * inspired by https://www.derpturkey.com/extending-tcp-socket-in-node-js/
 */
export declare class Connection extends Duplex {
    private socket;
    private readonly connectionAuthentication;
    private flowController;
    private logger;
    protected keyPair: Keypair;
    protected localListeningPort: number;
    protected remotePublicKeyECDH?: Buffer;
    protected localNonce: Buffer;
    protected remoteNonce?: Buffer;
    protected localSequence: Buffer;
    protected remoteSequence: Buffer;
    protected sendingMacKey?: Buffer;
    protected receivingMacKey?: Buffer;
    protected lengthNextMessage: number;
    protected reading: boolean;
    protected readState: ReadState;
    protected handshakeState: HandshakeState;
    protected remoteCalledUs: boolean;
    protected receiveTransactionMessages: boolean;
    protected receiveSCPMessages: boolean;
    localNodeInfo: NodeInfo;
    remoteNodeInfo?: NodeInfo;
    sendMoreMsgReceivedCounter: number;
    remoteIp: string;
    remotePort: number;
    remotePublicKey?: string;
    remotePublicKeyRaw?: Buffer;
    constructor(connectionOptions: ConnectionOptions, socket: Socket, connectionAuthentication: ConnectionAuthentication, flowController: FlowController, logger: P.Logger);
    get localPublicKey(): PublicKey;
    get localPublicKeyRaw(): Buffer;
    get remoteAddress(): string;
    get localAddress(): string;
    connect(): void;
    isConnected(): boolean;
    end(): this;
    destroy(error?: Error): this;
    /**
     * Fires when the socket has connected. This method initiates the
     * handshake and if there is a failure, terminates the connection.
     */
    protected onConnected(): void;
    protected onReadable(): void;
    protected processNextMessage(): Result<boolean, Error>;
    protected verifyAuthentication(authenticatedMessageV0XDR: AuthenticatedMessageV0, messageType: number, body: Buffer): Result<void, Error>;
    protected processNextMessageLength(): boolean;
    protected handleStellarMessage(stellarMessage: StellarMessage, stellarMessageSize: number): Result<boolean, Error>;
    protected sendHello(): Result<void, Error>;
    protected completeHandshake(): Result<void, Error>;
    protected doneProcessing(messageType: MessageType, stellarMessageSize: number): void;
    /**
     * Convenience method that encapsulates write. Pass callback that will be invoked when message is successfully sent.
     * Returns: <boolean> false if the stream wishes for the calling code to wait for the 'drain' event to be emitted before continuing to write additional data; otherwise true.
     */
    sendStellarMessage(message: StellarMessage, cb?: (error: Error | null | undefined) => void): boolean;
    protected sendAuthMessage(): Result<void, Error>;
    protected increaseLocalSequenceByOne(): void;
    protected increaseBufferByOne(buf: Buffer): Buffer;
    protected increaseRemoteSequenceByOne(): void;
    protected authenticateMessage(message: xdr.StellarMessage): Result<xdr.AuthenticatedMessage, Error>;
    protected getMacForAuthenticatedMessage(message: xdr.StellarMessage): xdr.HmacSha256Mac;
    protected processHelloMessage(hello: xdr.Hello): Result<void, Error>;
    _read(): void;
    _write(message: StellarMessage, encoding: string, callback: (error?: Error | null) => void): void;
    _final(cb?: () => void): void;
}
export {};
//# sourceMappingURL=connection.d.ts.map