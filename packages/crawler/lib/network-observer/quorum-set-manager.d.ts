import { PublicKey, QuorumSet } from 'shared';
import * as P from 'pino';
import { xdr } from '@stellar/stellar-base';
import { PeerNode } from '../peer-node';
import { Result } from 'neverthrow';
import { ConnectionManager } from './connection-manager';
import { Observation } from './observation';
type QuorumSetHash = string;
/**
 * Fetches quorumSets in a sequential way from connected nodes.
 * Makes sure every peerNode that sent a scp message with a hash, gets the correct quorumSet.
 */
export declare class QuorumSetManager {
    private connectionManager;
    private quorumRequestTimeoutMS;
    private logger;
    constructor(connectionManager: ConnectionManager, quorumRequestTimeoutMS: number, logger: P.Logger);
    onNodeDisconnected(publicKey: PublicKey, observation: Observation): void;
    processQuorumSetHashFromStatement(peer: PeerNode, scpStatement: xdr.ScpStatement, observation: Observation): void;
    processQuorumSet(quorumSetHash: QuorumSetHash, quorumSet: QuorumSet, sender: PublicKey, observation: Observation): void;
    peerNodeDoesNotHaveQuorumSet(peerPublicKey: PublicKey, quorumSetHash: QuorumSetHash, observation: Observation): void;
    protected requestQuorumSet(quorumSetHash: QuorumSetHash, observation: Observation): void;
    protected getQuorumSetHashOwners(quorumSetHash: QuorumSetHash, observation: Observation): Set<string>;
    protected getQuorumSetHash(scpStatement: xdr.ScpStatement): Result<QuorumSetHash, Error>;
    protected clearQuorumSetRequest(peerPublicKey: PublicKey, observation: Observation): void;
}
export {};
//# sourceMappingURL=quorum-set-manager.d.ts.map