import { Keypair, xdr } from '@stellar/stellar-base';
import UnsignedHyper = xdr.UnsignedHyper;
type Curve25519SecretBuffer = Buffer;
type Curve25519PublicBuffer = Buffer;
interface AuthCert {
    publicKeyECDH: Curve25519PublicBuffer;
    expiration: UnsignedHyper;
    signature: Buffer;
}
export declare class ConnectionAuthentication {
    secretKeyECDH: Curve25519SecretBuffer;
    publicKeyECDH: Curve25519PublicBuffer;
    weCalledRemoteSharedKeys: Map<string, Buffer<ArrayBufferLike>>;
    remoteCalledUsSharedKeys: Map<string, Buffer<ArrayBufferLike>>;
    networkId: Buffer;
    keyPair: Keypair;
    protected authCert?: AuthCert;
    protected authCertExpiration: number;
    static AUTH_EXPIRATION_LIMIT: number;
    constructor(keyPair: Keypair, networkId: Buffer);
    getAuthCert(validAt: Date): AuthCert;
    getSharedKey(remotePublicKeyECDH: Curve25519PublicBuffer, weCalledRemote?: boolean): Buffer;
    createAuthCert(time: Date): AuthCert;
    verifyRemoteAuthCert(time: Date, remotePublicKey: Buffer, authCert: xdr.AuthCert): boolean;
    getSendingMacKey(localNonce: Buffer, remoteNonce: Buffer, remotePublicKeyECDH: Curve25519PublicBuffer, weCalledRemote?: boolean): Buffer;
    getReceivingMacKey(localNonce: Buffer, remoteNonce: Buffer, remotePublicKeyECDH: Curve25519PublicBuffer, weCalledRemote?: boolean): Buffer;
}
export {};
//# sourceMappingURL=connection-authentication.d.ts.map