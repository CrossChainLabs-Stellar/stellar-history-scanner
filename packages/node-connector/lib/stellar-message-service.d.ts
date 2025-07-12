import { xdr } from '@stellar/stellar-base';
import { Result } from 'neverthrow';
import ScpEnvelope = xdr.ScpEnvelope;
import ScpStatement = xdr.ScpStatement;
export interface QuorumSetDTO {
    validators: string[];
    innerQuorumSets: QuorumSetDTO[];
    threshold: number;
}
export declare function verifyStatementXDRSignature(statementXDR: Buffer, peerId: Buffer, signature: Buffer, network: Buffer): Result<boolean, Error>;
export declare function createStatementXDRSignature(scpStatementXDR: Buffer, publicKey: Buffer, secretKey: Buffer, network: Buffer): Result<Buffer, Error>;
export declare function getPublicKeyStringFromBuffer(buffer: Buffer): Result<string, Error>;
export declare function createSCPEnvelopeSignature(scpStatement: ScpStatement, publicKey: Buffer, secretKey: Buffer, network: Buffer): Result<Buffer, Error>;
export declare function verifySCPEnvelopeSignature(scpEnvelope: ScpEnvelope, network: Buffer): Result<boolean, Error>;
export declare function getQuorumSetFromMessage(scpQuorumSetMessage: xdr.ScpQuorumSet): Result<QuorumSetDTO, Error>;
export declare function getIpFromPeerAddress(peerAddress: xdr.PeerAddress): Result<string, Error>;
//# sourceMappingURL=stellar-message-service.d.ts.map