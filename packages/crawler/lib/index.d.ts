import { Crawler } from './crawler';
import { pino } from 'pino';
import { CrawlerConfiguration } from './crawler-configuration';
import { CrawlFactory } from './crawl-factory';
export { Crawler } from './crawler';
export { CrawlResult } from './crawl-result';
export { PeerNode } from './peer-node';
export { default as jsonStorage } from './utilities/json-storage';
export declare function createLogger(): pino.Logger;
export declare function createCrawlFactory(config: CrawlerConfiguration, logger?: pino.Logger): CrawlFactory;
export declare function createCrawler(config: CrawlerConfiguration, logger?: pino.Logger): Crawler;
export { CrawlerConfiguration } from './crawler-configuration';
export { CrawlFactory } from './crawl-factory';
export { NodeAddress } from './node-address';
export { Ledger } from './crawler';
export { Crawl } from './crawl';
//# sourceMappingURL=index.d.ts.map