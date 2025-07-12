import { xdr } from '@stellar/stellar-base';
import { Result } from 'neverthrow';
import { ScpStatementHandler } from './scp-statement/scp-statement-handler';
import { Ledger } from '../../../../crawler';
import { Observation } from '../../../observation';
export declare class ScpEnvelopeHandler {
    private scpStatementHandler;
    constructor(scpStatementHandler: ScpStatementHandler);
    handle(scpEnvelope: xdr.ScpEnvelope, observation: Observation): Result<{
        closedLedger: Ledger | null;
    }, Error>;
    private verifySignature;
    private isValidLedger;
    private isCached;
}
//# sourceMappingURL=scp-envelope-handler.d.ts.map