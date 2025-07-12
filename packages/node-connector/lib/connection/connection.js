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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const stellar_base_1 = require("@stellar/stellar-base");
const neverthrow_1 = require("neverthrow");
const crypto_helper_1 = require("../crypto-helper");
const stream_1 = require("stream");
const handshake_message_creator_1 = __importDefault(require("./handshake-message-creator"));
const xdr_buffer_converter_1 = __importDefault(require("./xdr-buffer-converter"));
const async = __importStar(require("async"));
const xdr_message_handler_1 = require("./xdr-message-handler");
var StellarMessage = stellar_base_1.xdr.StellarMessage;
var MessageType = stellar_base_1.xdr.MessageType;
const map_unknown_to_error_1 = require("../map-unknown-to-error");
var ReadState;
(function (ReadState) {
    ReadState[ReadState["ReadyForLength"] = 0] = "ReadyForLength";
    ReadState[ReadState["ReadyForMessage"] = 1] = "ReadyForMessage";
    ReadState[ReadState["Blocked"] = 2] = "Blocked";
})(ReadState || (ReadState = {}));
var HandshakeState;
(function (HandshakeState) {
    HandshakeState[HandshakeState["CONNECTING"] = 0] = "CONNECTING";
    HandshakeState[HandshakeState["CONNECTED"] = 1] = "CONNECTED";
    HandshakeState[HandshakeState["GOT_HELLO"] = 2] = "GOT_HELLO";
    HandshakeState[HandshakeState["COMPLETED"] = 3] = "COMPLETED";
})(HandshakeState || (HandshakeState = {}));
/**
 * Duplex stream that wraps a tcp socket and handles the handshake to a stellar core node and all authentication verification of overlay messages. It encapsulates incoming and outgoing connections to and from stellar nodes.
 *
 * https://github.com/stellar/stellar-core/blob/9c3e67776449ae249aa811e99cbd6eee202bd2b6/src/xdr/Stellar-overlay.x#L219
 * It returns xdr.StellarMessages to the consumer.
 * It accepts xdr.StellarMessages when handshake is completed and wraps them in a correct AuthenticatedMessage before sending
 *
 * inspired by https://www.derpturkey.com/extending-tcp-socket-in-node-js/
 */
class Connection extends stream_1.Duplex {
    socket;
    connectionAuthentication;
    flowController;
    logger;
    keyPair;
    localListeningPort = 11625;
    remotePublicKeyECDH;
    localNonce;
    remoteNonce;
    localSequence;
    remoteSequence;
    sendingMacKey;
    receivingMacKey;
    lengthNextMessage = 0;
    reading = false;
    readState = ReadState.ReadyForLength;
    handshakeState = HandshakeState.CONNECTING;
    remoteCalledUs = true;
    receiveTransactionMessages = true;
    receiveSCPMessages = true;
    localNodeInfo;
    remoteNodeInfo;
    sendMoreMsgReceivedCounter = 0;
    remoteIp;
    remotePort;
    remotePublicKey;
    remotePublicKeyRaw;
    constructor(connectionOptions, socket, connectionAuthentication, flowController, logger) {
        super({ objectMode: true });
        this.socket = socket;
        this.connectionAuthentication = connectionAuthentication;
        this.flowController = flowController;
        this.logger = logger;
        this.remoteIp = connectionOptions.ip;
        this.remotePort = connectionOptions.port;
        this.socket = socket; //if we initiate, could we create the socket here?
        if (this.socket.readable)
            this.handshakeState = HandshakeState.CONNECTED;
        this.remoteCalledUs = connectionOptions.remoteCalledUs;
        this.socket.setTimeout(2500);
        this.connectionAuthentication = connectionAuthentication;
        this.keyPair = connectionOptions.keyPair;
        this.localNonce = (0, stellar_base_1.hash)(Buffer.from(bignumber_js_1.default.random()));
        this.localSequence = Buffer.alloc(8);
        this.remoteSequence = Buffer.alloc(8);
        this.localNodeInfo = connectionOptions.localNodeInfo;
        this.receiveSCPMessages = connectionOptions.receiveSCPMessages;
        this.receiveTransactionMessages =
            connectionOptions.receiveTransactionMessages;
        this.socket.on('close', (hadError) => this.emit('close', hadError));
        this.socket.on('connect', () => this.onConnected());
        this.socket.on('drain', () => this.emit('drain'));
        this.socket.on('end', () => this.emit('end'));
        this.socket.on('error', (error) => this.emit('error', error));
        this.socket.on('lookup', (e, a, f, h) => this.emit('lookup', e, a, f, h));
        this.socket.on('readable', () => this.onReadable());
        this.socket.on('timeout', () => this.emit('timeout'));
        this.logger = logger;
    }
    get localPublicKey() {
        return this.keyPair.publicKey();
    }
    get localPublicKeyRaw() {
        return this.keyPair.rawPublicKey();
    }
    get remoteAddress() {
        return this.remoteIp + ':' + this.remotePort;
    }
    get localAddress() {
        return this.socket.localAddress + ':' + this.socket.localPort;
    }
    connect() {
        this.handshakeState = HandshakeState.CONNECTING;
        this.socket.connect(this.remotePort, this.remoteIp);
    }
    isConnected() {
        return this.handshakeState === HandshakeState.COMPLETED;
    }
    end() {
        this.socket.end();
        return this;
    }
    destroy(error) {
        this.socket.destroy(error);
        return this;
    }
    /**
     * Fires when the socket has connected. This method initiates the
     * handshake and if there is a failure, terminates the connection.
     */
    onConnected() {
        this.logger.debug({
            remote: this.remoteAddress,
            local: this.localAddress
        }, 'Connected to socket, initiating handshake');
        this.handshakeState = HandshakeState.CONNECTED;
        const result = this.sendHello();
        if (result.isErr()) {
            this.logger.error({ remote: this.remoteAddress, local: this.localAddress }, result.error.message);
            this.socket.destroy(result.error);
        }
    }
    onReadable() {
        this.logger.trace({ remote: this.remoteAddress, local: this.localAddress }, 'Rcv readable event');
        //a socket can receive a 'readable' event when already processing a previous readable event.
        // Because the same internal read buffer is processed (the running whilst loop will also loop over the new data),
        // we can safely ignore it.
        if (this.reading) {
            this.logger.trace({ remote: this.remoteAddress, local: this.localAddress }, 'Ignoring, already reading');
            return;
        }
        this.reading = true;
        //a socket is a duplex stream. It has a write buffer (when we write messages to the socket, to be sent to the peer). And it has a read buffer, data we have to read from the socket, data that is sent by the peer to us. If we don't read the data (or too slow), we will exceed the readableHighWatermark of the socket. This will make the socket stop receiving data or using tcp to signal to the sender that we want to receive the data slower.
        if (this.socket.readableLength >= this.socket.readableHighWaterMark)
            this.logger.debug({
                remote: this.remoteAddress,
                local: this.localAddress
            }, 'Socket buffer exceeding high watermark');
        let processedMessages = 0;
        async.whilst((cb) => {
            // async loop to interleave sockets, otherwise handling all the messages in the buffer is a blocking loop
            return cb(null, this.reading);
        }, (done) => {
            let processError = null;
            if (this.readState === ReadState.ReadyForLength) {
                if (this.processNextMessageLength()) {
                    this.readState = ReadState.ReadyForMessage;
                }
                else {
                    this.reading = false; //we stop processing the buffer
                }
            }
            if (this.readState === ReadState.ReadyForMessage) {
                this.processNextMessage()
                    .map((containedAMessage) => {
                    if (containedAMessage) {
                        this.readState = ReadState.ReadyForLength;
                        processedMessages++;
                    }
                    else
                        this.reading = false;
                })
                    .mapErr((error) => {
                    processError = error;
                    this.reading = false;
                });
            }
            if (this.readState === ReadState.Blocked) {
                //we don't process anymore messages because consumer cant handle it.
                // When our internal buffer reaches the high watermark, the underlying tcp protocol will signal the sender that we can't handle the traffic.
                this.logger.debug({ remote: this.remoteAddress, local: this.localAddress }, 'Reading blocked');
                this.reading = false;
            }
            if (processError || !this.reading) {
                done(processError); //end the loop
            }
            else if (processedMessages % 10 === 0) {
                //if ten messages are sequentially processed, we give control back to event loop
                setImmediate(() => done(null)); //other sockets will be able to process messages
            }
            else
                done(null); //another iteration
        }, (err) => {
            //function gets called when we are no longer reading
            if (err) {
                const error = (0, map_unknown_to_error_1.mapUnknownToError)(err);
                this.logger.error({ remote: this.remoteAddress, local: this.localAddress }, error.message);
                this.socket.destroy(error);
            }
            this.logger.trace({
                remote: this.remoteAddress,
                local: this.localAddress
            }, 'handled messages in chunk: ' + processedMessages);
        });
    }
    processNextMessage() {
        //If size bytes are not available to be read,
        // null will be returned unless the stream has ended,
        // in which case all the data remaining in the internal buffer will be returned.
        let data = null;
        try {
            data = this.socket.read(this.lengthNextMessage);
        }
        catch (e) {
            this.logger.error({
                remote: this.remoteAddress,
                error: (0, map_unknown_to_error_1.mapUnknownToError)(e).message,
                length: this.lengthNextMessage
            }, 'Error reading from socket');
            return (0, neverthrow_1.err)((0, map_unknown_to_error_1.mapUnknownToError)(e));
        }
        if (!data || data.length !== this.lengthNextMessage) {
            this.logger.trace({
                remote: this.remoteAddress,
                local: this.localAddress
            }, 'Not enough data left in buffer');
            return (0, neverthrow_1.ok)(false);
        }
        const result = (0, xdr_message_handler_1.parseAuthenticatedMessageXDR)(data); //if transactions are not required, we avoid parsing them to objects and verifying the macs to gain performance
        if (result.isErr()) {
            return (0, neverthrow_1.err)(result.error);
        }
        const authenticatedMessageV0XDR = result.value;
        const stellarMessageSize = data.length - 32 - 12;
        const messageType = authenticatedMessageV0XDR.messageTypeXDR.readInt32BE(0);
        this.logger.trace({
            remote: this.remoteAddress,
            local: this.localAddress
        }, 'Rcv msg of type: ' +
            messageType +
            ' with seq: ' +
            authenticatedMessageV0XDR.sequenceNumberXDR.readInt32BE(4));
        this.logger.trace({
            remote: this.remoteAddress,
            local: this.localAddress
        }, 'Rcv ' + messageType);
        if ([
            MessageType.transaction().value,
            MessageType.floodAdvert().value
        ].includes(messageType) &&
            !this.receiveTransactionMessages) {
            this.increaseRemoteSequenceByOne();
            this.doneProcessing(messageType === MessageType.transaction().value
                ? MessageType.transaction()
                : MessageType.floodAdvert(), stellarMessageSize);
            return (0, neverthrow_1.ok)(true);
        }
        if (messageType === MessageType.scpMessage().value &&
            !this.receiveSCPMessages) {
            this.increaseRemoteSequenceByOne();
            return (0, neverthrow_1.ok)(true);
        }
        if (this.handshakeState >= HandshakeState.GOT_HELLO &&
            messageType !== MessageType.errorMsg().value) {
            const result = this.verifyAuthentication(authenticatedMessageV0XDR, messageType, data.slice(4, data.length - 32));
            this.increaseRemoteSequenceByOne();
            if (result.isErr())
                return (0, neverthrow_1.err)(result.error);
        }
        let stellarMessage;
        try {
            stellarMessage = StellarMessage.fromXDR(data.slice(12, data.length - 32));
        }
        catch (error) {
            if (error instanceof Error)
                return (0, neverthrow_1.err)(error);
            else
                return (0, neverthrow_1.err)(new Error('Error converting xdr to StellarMessage'));
        }
        const handleStellarMessageResult = this.handleStellarMessage(stellarMessage, stellarMessageSize);
        if (handleStellarMessageResult.isErr()) {
            return (0, neverthrow_1.err)(handleStellarMessageResult.error);
        }
        if (!handleStellarMessageResult.value) {
            this.logger.debug({
                remote: this.remoteAddress,
                local: this.localAddress
            }, 'Consumer cannot handle load, stop reading from socket');
            this.readState = ReadState.Blocked;
            return (0, neverthrow_1.ok)(false);
        } //our read buffer is full, meaning the consumer did not process the messages timely
        return (0, neverthrow_1.ok)(true);
    }
    verifyAuthentication(authenticatedMessageV0XDR, messageType, body) {
        if (!this.remoteSequence.equals(authenticatedMessageV0XDR.sequenceNumberXDR)) {
            //must be handled on main thread because workers could mix up order of messages.
            return (0, neverthrow_1.err)(new Error('Invalid sequence number'));
        }
        try {
            if (this.receivingMacKey &&
                !(0, crypto_helper_1.verifyHmac)(authenticatedMessageV0XDR.macXDR, this.receivingMacKey, body)) {
                return (0, neverthrow_1.err)(new Error('Invalid hmac'));
            }
        }
        catch (error) {
            if (error instanceof Error)
                return (0, neverthrow_1.err)(error);
            else
                return (0, neverthrow_1.err)(new Error('Error verifying authentication'));
        }
        return (0, neverthrow_1.ok)(undefined);
    }
    processNextMessageLength() {
        this.logger.trace({ remote: this.remoteAddress, local: this.localAddress }, 'Parsing msg length');
        const data = this.socket.read(4);
        if (data) {
            this.lengthNextMessage =
                xdr_buffer_converter_1.default.getMessageLengthFromXDRBuffer(data);
            this.logger.trace({
                remote: this.remoteAddress,
                local: this.localAddress
            }, 'Next msg length: ' + this.lengthNextMessage);
            return true;
        }
        else {
            this.logger.trace({
                remote: this.remoteAddress,
                local: this.localAddress
            }, 'Not enough data left in buffer');
            return false;
            //we stay in the ReadyForLength state until the next readable event
        }
    }
    //return true if handling was successful, false if consumer was overloaded, Error on error
    handleStellarMessage(stellarMessage, stellarMessageSize) {
        switch (stellarMessage.switch()) {
            case MessageType.hello(): {
                const processHelloMessageResult = this.processHelloMessage(stellarMessage.hello());
                if (processHelloMessageResult.isErr()) {
                    return (0, neverthrow_1.err)(processHelloMessageResult.error);
                }
                this.handshakeState = HandshakeState.GOT_HELLO;
                let result;
                if (this.remoteCalledUs)
                    result = this.sendHello();
                else
                    result = this.sendAuthMessage();
                if (result.isErr()) {
                    return (0, neverthrow_1.err)(result.error);
                }
                return (0, neverthrow_1.ok)(true);
            }
            case MessageType.auth(): {
                const completedHandshakeResult = this.completeHandshake();
                if (completedHandshakeResult.isErr())
                    return (0, neverthrow_1.err)(completedHandshakeResult.error);
                return (0, neverthrow_1.ok)(true);
            }
            case MessageType.sendMoreExtended(): {
                this.sendMoreMsgReceivedCounter++; //server send more functionality not implemented; only for testing purposes;
                return (0, neverthrow_1.ok)(true);
            }
            case MessageType.sendMore(): {
                this.sendMoreMsgReceivedCounter++; //server send more functionality not implemented; only for testing purposes;
                return (0, neverthrow_1.ok)(true);
            }
            default:
                // we push non-handshake messages to our readable buffer for our consumers
                this.logger.debug({
                    remote: this.remoteAddress,
                    local: this.localAddress
                }, 'Rcv ' + stellarMessage.switch().name);
                return (0, neverthrow_1.ok)(this.push({
                    stellarMessage: stellarMessage,
                    done: () => this.doneProcessing(stellarMessage.switch(), stellarMessageSize)
                }));
        }
    }
    sendHello() {
        this.logger.trace({ remote: this.remoteAddress, local: this.localAddress }, 'send HELLO');
        const certResult = handshake_message_creator_1.default.createAuthCert(this.connectionAuthentication);
        if (certResult.isErr())
            return (0, neverthrow_1.err)(certResult.error);
        const helloResult = handshake_message_creator_1.default.createHelloMessage(this.keyPair.xdrPublicKey(), this.localNonce, certResult.value, this.connectionAuthentication.networkId, this.localNodeInfo.ledgerVersion, this.localNodeInfo.overlayVersion, this.localNodeInfo.overlayMinVersion, this.localNodeInfo.versionString, this.localListeningPort);
        if (helloResult.isErr()) {
            return (0, neverthrow_1.err)(helloResult.error);
        }
        this.write(helloResult.value);
        return (0, neverthrow_1.ok)(undefined);
    }
    completeHandshake() {
        if (this.remoteCalledUs) {
            const authResult = this.sendAuthMessage();
            if (authResult.isErr())
                return (0, neverthrow_1.err)(authResult.error);
        }
        this.logger.debug({ remote: this.remoteAddress, local: this.localAddress }, 'Handshake Completed');
        this.handshakeState = HandshakeState.COMPLETED;
        this.socket.setTimeout(10000);
        this.emit('connect', this.remotePublicKey, this.remoteNodeInfo);
        this.emit('ready');
        if (!this.remoteNodeInfo)
            throw new Error('No remote overlay version after handshake');
        const stellarMessageOrNull = this.flowController.start();
        if (stellarMessageOrNull !== null)
            this.sendStellarMessage(stellarMessageOrNull);
        return (0, neverthrow_1.ok)(undefined);
    }
    doneProcessing(messageType, stellarMessageSize) {
        const stellarMessageOrNull = this.flowController.sendMore(messageType, stellarMessageSize);
        if (stellarMessageOrNull !== null)
            this.sendStellarMessage(stellarMessageOrNull);
    }
    /**
     * Convenience method that encapsulates write. Pass callback that will be invoked when message is successfully sent.
     * Returns: <boolean> false if the stream wishes for the calling code to wait for the 'drain' event to be emitted before continuing to write additional data; otherwise true.
     */
    sendStellarMessage(message, cb) {
        this.logger.debug({ remote: this.remoteAddress, local: this.localAddress }, 'send ' + message.switch().name);
        return this.write(message, cb);
    }
    sendAuthMessage() {
        this.logger.trace({ remote: this.remoteAddress, local: this.localAddress }, 'send auth');
        const authMessageResult = handshake_message_creator_1.default.createAuthMessage(this.localNodeInfo.overlayVersion >= 28 //remove when min overlay version is 28
        );
        if (authMessageResult.isErr())
            return (0, neverthrow_1.err)(authMessageResult.error);
        this.write(authMessageResult.value);
        return (0, neverthrow_1.ok)(undefined);
    }
    increaseLocalSequenceByOne() {
        this.localSequence = this.increaseBufferByOne(this.localSequence);
    }
    increaseBufferByOne(buf) {
        //todo: move to helper
        for (let i = buf.length - 1; i >= 0; i--) {
            if (buf[i]++ !== 255)
                break;
        }
        return buf;
    }
    increaseRemoteSequenceByOne() {
        this.remoteSequence = this.increaseBufferByOne(this.remoteSequence);
    }
    authenticateMessage(message) {
        try {
            const xdrAuthenticatedMessageV0 = new stellar_base_1.xdr.AuthenticatedMessageV0({
                sequence: stellar_base_1.xdr.Uint64.fromXDR(this.localSequence),
                message: message,
                mac: this.getMacForAuthenticatedMessage(message)
            });
            //@ts-ignore wrong type information. Because the switch is a number, not an enum, it does not work as advertised.
            // We have to create the union object through the constructor https://github.com/stellar/js-xdr/blob/892b662f98320e1221d8f53ff17c6c10442e086d/src/union.js#L9
            // However the constructor type information is also missing.
            const authenticatedMessage = new stellar_base_1.xdr.AuthenticatedMessage(
            //@ts-ignore
            0, xdrAuthenticatedMessageV0);
            if (message.switch() !== MessageType.hello() &&
                message.switch() !== MessageType.errorMsg())
                this.increaseLocalSequenceByOne();
            return (0, neverthrow_1.ok)(authenticatedMessage);
        }
        catch (error) {
            if (error instanceof Error)
                return (0, neverthrow_1.err)(new Error('authenticateMessage failed: ' + error.message));
            else
                return (0, neverthrow_1.err)(new Error('authenticateMessage failed'));
        }
    }
    getMacForAuthenticatedMessage(message) {
        let mac;
        if (this.remotePublicKeyECDH === undefined ||
            this.sendingMacKey === undefined)
            mac = Buffer.alloc(32);
        else
            mac = (0, crypto_helper_1.createSHA256Hmac)(Buffer.concat([this.localSequence, message.toXDR()]), this.sendingMacKey);
        return new stellar_base_1.xdr.HmacSha256Mac({
            mac: mac
        });
    }
    processHelloMessage(hello) {
        if (!this.connectionAuthentication.verifyRemoteAuthCert(new Date(), hello.peerId().value(), hello.cert()))
            return (0, neverthrow_1.err)(new Error('Invalid auth cert'));
        try {
            this.remoteNonce = hello.nonce();
            this.remotePublicKeyECDH = hello.cert().pubkey().key();
            this.remotePublicKey = stellar_base_1.StrKey.encodeEd25519PublicKey(hello.peerId().value());
            this.remotePublicKeyRaw = hello.peerId().value();
            this.remoteNodeInfo = {
                ledgerVersion: hello.ledgerVersion(),
                overlayVersion: hello.overlayVersion(),
                overlayMinVersion: hello.overlayMinVersion(),
                versionString: hello.versionStr().toString(),
                networkId: hello.networkId().toString('base64')
            };
            this.sendingMacKey = this.connectionAuthentication.getSendingMacKey(this.localNonce, this.remoteNonce, this.remotePublicKeyECDH, !this.remoteCalledUs);
            this.receivingMacKey = this.connectionAuthentication.getReceivingMacKey(this.localNonce, this.remoteNonce, this.remotePublicKeyECDH, !this.remoteCalledUs);
            return (0, neverthrow_1.ok)(undefined);
        }
        catch (error) {
            if (error instanceof Error)
                return (0, neverthrow_1.err)(error);
            else
                return (0, neverthrow_1.err)(new Error('Error processing hello message'));
        }
    }
    _read() {
        if (this.handshakeState !== HandshakeState.COMPLETED) {
            return;
        }
        if (this.readState === ReadState.Blocked) {
            //the consumer wants to read again
            this.logger.trace({
                remote: this.remoteAddress,
                local: this.localAddress
            }, 'ReadState unblocked by consumer');
            this.readState = ReadState.ReadyForLength;
        }
        // Trigger a read but wait until the end of the event loop.
        // This is necessary when reading in paused mode where
        // _read was triggered by stream.read() originating inside
        // a "readable" event handler. Attempting to push more data
        // synchronously will not trigger another "readable" event.
        setImmediate(() => this.onReadable());
    }
    _write(message, encoding, callback) {
        this.logger.trace({
            remote: this.remoteAddress,
            local: this.localAddress
        }, 'write ' + message.switch().name + ' to socket');
        const authenticatedMessageResult = this.authenticateMessage(message);
        if (authenticatedMessageResult.isErr()) {
            this.logger.error({
                remote: this.remoteAddress,
                local: this.localAddress
            }, authenticatedMessageResult.error.message);
            return callback(authenticatedMessageResult.error);
        }
        const bufferResult = xdr_buffer_converter_1.default.getXdrBufferFromMessage(authenticatedMessageResult.value);
        if (bufferResult.isErr()) {
            this.logger.error({ remote: this.remoteAddress, local: this.localAddress }, bufferResult.error.message);
            return callback(bufferResult.error);
        }
        this.logger.trace({
            remote: this.remoteAddress,
            local: this.localAddress
        }, 'Write msg xdr: ' + bufferResult.value.toString('base64'));
        if (!this.socket.write(bufferResult.value)) {
            this.socket.once('drain', callback); //respecting backpressure
        }
        else {
            process.nextTick(callback);
        }
    }
    _final(cb) {
        this.socket.end(cb);
    }
}
exports.Connection = Connection;
