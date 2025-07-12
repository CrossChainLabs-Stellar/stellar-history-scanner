import * as P from 'pino';
import { Ledger } from '../../../../../../crawler';
import { PeerNodeCollection } from '../../../../../../peer-node-collection';
import { ExternalizeData } from './map-externalize-statement';
import { Slot } from './slot';
export declare class ExternalizeStatementHandler {
    private logger;
    constructor(logger: P.Logger);
    handle(peerNodes: PeerNodeCollection, slot: Slot, externalizeData: ExternalizeData, localCloseTime: Date, latestConfirmedClosedLedger: Ledger): Ledger | null;
    private attemptSlotCloseConfirmation;
    private confirmLedgerCloseForPeersThatHaveExternalized;
    private logExternalizeMessage;
    private logLedgerClose;
}
//# sourceMappingURL=externalize-statement-handler.d.ts.map