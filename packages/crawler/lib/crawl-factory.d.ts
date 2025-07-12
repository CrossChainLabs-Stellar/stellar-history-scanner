import { Crawl } from './crawl';
import { ObservationFactory } from './network-observer/observation-factory';
import { NodeAddress } from './node-address';
import { QuorumSet } from 'shared';
import { Ledger } from './crawler';
import { P } from 'pino';
export declare class CrawlFactory {
    private observationFactory;
    private network;
    private logger;
    constructor(observationFactory: ObservationFactory, network: string, logger: P.Logger);
    createCrawl(nodesToCrawl: NodeAddress[], topTierAddresses: NodeAddress[], topTierQuorumSet: QuorumSet, latestConfirmedClosedLedger: Ledger, quorumSets: Map<string, QuorumSet>): Crawl;
}
//# sourceMappingURL=crawl-factory.d.ts.map