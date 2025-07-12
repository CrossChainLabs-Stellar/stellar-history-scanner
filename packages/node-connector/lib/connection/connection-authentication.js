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
exports.ConnectionAuthentication = void 0;
const stellar_base_1 = require("@stellar/stellar-base");
const sodium = __importStar(require("sodium-native"));
var EnvelopeType = stellar_base_1.xdr.EnvelopeType;
var Uint64 = stellar_base_1.xdr.Uint64;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const crypto_helper_1 = require("../crypto-helper");
class ConnectionAuthentication {
    secretKeyECDH;
    publicKeyECDH;
    weCalledRemoteSharedKeys = new Map();
    remoteCalledUsSharedKeys = new Map();
    networkId;
    keyPair;
    authCert;
    authCertExpiration = 0;
    static AUTH_EXPIRATION_LIMIT = 360000; //60 minutes
    constructor(keyPair, networkId) {
        this.networkId = networkId;
        this.keyPair = keyPair;
        this.secretKeyECDH = Buffer.alloc(32);
        sodium.randombytes_buf(this.secretKeyECDH);
        this.publicKeyECDH = Buffer.alloc(32);
        sodium.crypto_scalarmult_base(this.publicKeyECDH, this.secretKeyECDH);
    }
    getAuthCert(validAt) {
        if (!this.authCert ||
            this.authCertExpiration <
                validAt.getTime() + ConnectionAuthentication.AUTH_EXPIRATION_LIMIT / 2) {
            this.authCert = this.createAuthCert(validAt);
        }
        return this.authCert;
    }
    getSharedKey(remotePublicKeyECDH, weCalledRemote = true) {
        const remotePublicKeyECDHString = remotePublicKeyECDH.toString();
        let sharedKey;
        if (weCalledRemote)
            sharedKey = this.weCalledRemoteSharedKeys.get(remotePublicKeyECDHString);
        else
            sharedKey = this.remoteCalledUsSharedKeys.get(remotePublicKeyECDHString);
        if (!sharedKey) {
            let buf = Buffer.alloc(sodium.crypto_scalarmult_BYTES);
            sodium.crypto_scalarmult(buf, this.secretKeyECDH, remotePublicKeyECDH);
            if (weCalledRemote)
                buf = Buffer.concat([buf, this.publicKeyECDH, remotePublicKeyECDH]);
            else
                buf = Buffer.concat([buf, remotePublicKeyECDH, this.publicKeyECDH]);
            const zeroSalt = Buffer.alloc(32);
            sharedKey = (0, crypto_helper_1.createSHA256Hmac)(buf, zeroSalt);
            if (weCalledRemote)
                this.weCalledRemoteSharedKeys.set(remotePublicKeyECDHString, sharedKey);
            else
                this.remoteCalledUsSharedKeys.set(remotePublicKeyECDHString, sharedKey);
        }
        return sharedKey;
    }
    createAuthCert(time) {
        this.authCertExpiration =
            time.getTime() + ConnectionAuthentication.AUTH_EXPIRATION_LIMIT;
        const expiration = Uint64.fromString(this.authCertExpiration.toString());
        const rawSigData = Buffer.concat([
            this.networkId,
            //@ts-ignore
            EnvelopeType.envelopeTypeAuth().toXDR(),
            expiration.toXDR(),
            this.publicKeyECDH
        ]);
        const sha256RawSigData = (0, stellar_base_1.hash)(rawSigData);
        const signature = this.keyPair.sign(sha256RawSigData);
        return {
            publicKeyECDH: this.publicKeyECDH,
            expiration: expiration,
            signature: signature
        };
    }
    verifyRemoteAuthCert(time, remotePublicKey, authCert) {
        const expiration = new bignumber_js_1.default(authCert.expiration().toString());
        if (expiration.lt(Math.round(time.getTime() / 1000))) {
            return false;
        }
        const rawSigData = Buffer.concat([
            this.networkId,
            //@ts-ignore
            EnvelopeType.envelopeTypeAuth().toXDR(),
            authCert.expiration().toXDR(),
            authCert.pubkey().key()
        ]);
        const sha256RawSigData = (0, stellar_base_1.hash)(rawSigData);
        return (0, crypto_helper_1.verifySignature)(remotePublicKey, authCert.sig(), sha256RawSigData);
    }
    getSendingMacKey(localNonce, remoteNonce, remotePublicKeyECDH, weCalledRemote = true) {
        const buf = Buffer.concat([
            weCalledRemote ? Buffer.from([0]) : Buffer.from([1]),
            localNonce,
            remoteNonce,
            Buffer.from([1])
        ]);
        const sharedKey = this.getSharedKey(remotePublicKeyECDH, weCalledRemote);
        return (0, crypto_helper_1.createSHA256Hmac)(buf, sharedKey);
    }
    getReceivingMacKey(localNonce, remoteNonce, remotePublicKeyECDH, weCalledRemote = true) {
        const buf = Buffer.concat([
            weCalledRemote ? Buffer.from([1]) : Buffer.from([0]),
            remoteNonce,
            localNonce,
            Buffer.from([1])
        ]);
        const sharedKey = this.getSharedKey(remotePublicKeyECDH, weCalledRemote);
        return (0, crypto_helper_1.createSHA256Hmac)(buf, sharedKey);
    }
}
exports.ConnectionAuthentication = ConnectionAuthentication;
