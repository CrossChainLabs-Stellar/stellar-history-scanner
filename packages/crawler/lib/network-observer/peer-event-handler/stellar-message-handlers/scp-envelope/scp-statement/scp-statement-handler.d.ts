import * as P from 'pino';
import { xdr } from '@stellar/stellar-base';
import { QuorumSetManager } from '../../../../quorum-set-manager';
import { Result } from 'neverthrow';
import { ExternalizeStatementHandler } from './externalize/externalize-statement-handler';
import { Ledger } from '../../../../../crawler';
import { Observation } from '../../../../observation';
export declare class ScpStatementHandler {
    private quorumSetManager;
    private externalizeStatementHandler;
    private logger;
    constructor(quorumSetManager: QuorumSetManager, externalizeStatementHandler: ExternalizeStatementHandler, logger: P.Logger);
    handle(scpStatement: xdr.ScpStatement, observation: Observation): Result<{
        closedLedger: Ledger | null;
    }, Error>;
}
//# sourceMappingURL=scp-statement-handler.d.ts.map