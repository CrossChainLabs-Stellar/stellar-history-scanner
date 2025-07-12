import { Logger } from 'logger';
import { Scan } from '../scan/Scan';
import { ExceptionLogger } from 'exception-logger';
import { RangeScanner } from './RangeScanner';
import { ScanJob } from '../scan/ScanJob';
import { ScanSettingsFactory } from '../scan/ScanSettingsFactory';
export interface LedgerHeader {
    ledger: number;
    hash?: string;
}
export declare class Scanner {
    private rangeScanner;
    private scanJobSettingsFactory;
    private logger;
    private exceptionLogger;
    private readonly rangeSize;
    constructor(rangeScanner: RangeScanner, scanJobSettingsFactory: ScanSettingsFactory, logger: Logger, exceptionLogger: ExceptionLogger, rangeSize?: number);
    perform(time: Date, scanJob: ScanJob): Promise<Scan>;
    private scanInRanges;
}
//# sourceMappingURL=Scanner.d.ts.map