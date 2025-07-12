import 'reflect-metadata';
import { ScanError } from './ScanError';
import { ScanJob } from './ScanJob';
import { Result } from 'neverthrow';
import { CategoryScanner } from '../scanner/CategoryScanner';
import { ArchivePerformanceTester } from '../scanner/ArchivePerformanceTester';
import { ScanSettings } from './ScanSettings';
export declare class ScanSettingsFactory {
    private categoryScanner;
    private archivePerformanceTester;
    private slowArchiveMaxNumberOfLedgersToScan;
    constructor(categoryScanner: CategoryScanner, archivePerformanceTester: ArchivePerformanceTester, slowArchiveMaxNumberOfLedgersToScan?: number);
    determineSettings(scanJob: ScanJob): Promise<Result<ScanSettings, ScanError>>;
    private static createScanSettings;
    private determineConcurrencyAndSlowArchive;
    private determineLatestLedgerHeader;
    private determineFromLedger;
    private slowArchiveExceedsMaxLedgersToScan;
    private determineToLedger;
}
//# sourceMappingURL=ScanSettingsFactory.d.ts.map