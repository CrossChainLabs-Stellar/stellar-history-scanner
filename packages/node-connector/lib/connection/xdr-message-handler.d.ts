import { Result } from 'neverthrow';
export interface AuthenticatedMessageV0 {
    sequenceNumberXDR: Buffer;
    messageTypeXDR: Buffer;
    stellarMessageXDR: Buffer;
    macXDR: Buffer;
}
export declare function parseAuthenticatedMessageXDR(messageXDR: Buffer): Result<AuthenticatedMessageV0, Error>;
//# sourceMappingURL=xdr-message-handler.d.ts.map