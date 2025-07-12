import { xdr } from '@stellar/stellar-base';
import { Result } from 'neverthrow';
import AuthCert = xdr.AuthCert;
import Hello = xdr.Hello;
import { ConnectionAuthentication } from './connection-authentication';
declare const _default: {
    createAuthMessage: (flowControlInBytes?: boolean) => Result<xdr.StellarMessage, Error>;
    createHelloMessage: (peerId: xdr.PublicKey, nonce: Buffer, authCert: xdr.AuthCert, stellarNetworkId: Buffer, ledgerVersion: number, overlayVersion: number, overlayMinVersion: number, versionStr: string, listeningPort: number) => Result<Hello, Error>;
    createAuthCert: (connectionAuthentication: ConnectionAuthentication) => Result<AuthCert, Error>;
};
export default _default;
//# sourceMappingURL=handshake-message-creator.d.ts.map