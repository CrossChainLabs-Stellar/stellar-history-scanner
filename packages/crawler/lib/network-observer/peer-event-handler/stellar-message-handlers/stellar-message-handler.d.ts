import { xdr } from '@stellar/stellar-base';
import { P } from 'pino';
import { ScpEnvelopeHandler } from './scp-envelope/scp-envelope-handler';
import { QuorumSetManager } from '../../quorum-set-manager';
import { Result } from 'neverthrow';
import { NodeAddress } from '../../../node-address';
import { Ledger } from '../../../crawler';
import { Observation } from '../../observation';
type PublicKey = string;
export declare class StellarMessageHandler {
    private scpEnvelopeHandler;
    private quorumSetManager;
    private logger;
    constructor(scpEnvelopeHandler: ScpEnvelopeHandler, quorumSetManager: QuorumSetManager, logger: P.Logger);
    handleStellarMessage(sender: PublicKey, stellarMessage: xdr.StellarMessage, attemptLedgerClose: boolean, observation: Observation): Result<{
        closedLedger: Ledger | null;
        peers: NodeAddress[];
    }, Error>;
    private handlePeersMessage;
    private handleScpQuorumSetMessage;
    private handleDontHaveMessage;
    private handleErrorMsg;
    private onLoadTooHighReceived;
}
export {};
//# sourceMappingURL=stellar-message-handler.d.ts.map