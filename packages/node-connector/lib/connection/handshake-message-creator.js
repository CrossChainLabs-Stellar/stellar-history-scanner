"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stellar_base_1 = require("@stellar/stellar-base");
const neverthrow_1 = require("neverthrow");
exports.default = {
    createAuthMessage: function (flowControlInBytes = false) {
        try {
            const auth = new stellar_base_1.xdr.Auth({ flags: flowControlInBytes ? 200 : 100 });
            // @ts-ignore
            const authMessage = new stellar_base_1.xdr.StellarMessage.auth(auth);
            return (0, neverthrow_1.ok)(authMessage);
        }
        catch (error) {
            if (error instanceof Error)
                return (0, neverthrow_1.err)(new Error('Auth msg create failed: ' + error.message));
            else
                return (0, neverthrow_1.err)(new Error('Auth msg create failed'));
        }
    },
    createHelloMessage: function (peerId, nonce, authCert, stellarNetworkId, ledgerVersion, overlayVersion, overlayMinVersion, versionStr, listeningPort) {
        try {
            const hello = new stellar_base_1.xdr.Hello({
                ledgerVersion: ledgerVersion,
                overlayVersion: overlayVersion,
                overlayMinVersion: overlayMinVersion,
                networkId: stellarNetworkId,
                versionStr: versionStr,
                listeningPort: listeningPort,
                peerId: peerId,
                cert: authCert,
                nonce: nonce
            });
            //@ts-ignore
            return (0, neverthrow_1.ok)(new stellar_base_1.xdr.StellarMessage.hello(hello));
        }
        catch (error) {
            let msg = 'CreateHelloMessage failed';
            if (error instanceof Error)
                msg += ': ' + error.message;
            return (0, neverthrow_1.err)(new Error(msg));
        }
    },
    createAuthCert: function (connectionAuthentication) {
        try {
            const curve25519PublicKey = new stellar_base_1.xdr.Curve25519Public({
                key: connectionAuthentication.publicKeyECDH
            });
            return (0, neverthrow_1.ok)(new stellar_base_1.xdr.AuthCert({
                pubkey: curve25519PublicKey,
                expiration: connectionAuthentication.getAuthCert(new Date())
                    .expiration,
                sig: connectionAuthentication.getAuthCert(new Date()).signature
            }));
        }
        catch (error) {
            if (error instanceof Error)
                return (0, neverthrow_1.err)(new Error('createAuthCert failed: ' + error.message));
            else
                return (0, neverthrow_1.err)(new Error('createAuthCert failed'));
        }
    }
};
