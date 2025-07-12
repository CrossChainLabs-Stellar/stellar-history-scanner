import { NodeAddress } from './node-address';
import { Crawl } from './crawl';
export interface CrawlTask {
    nodeAddress: NodeAddress;
    crawl: Crawl;
    connectCallback: () => void;
}
//# sourceMappingURL=crawl-task.d.ts.map