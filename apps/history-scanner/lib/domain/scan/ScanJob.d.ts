import { Url } from 'http-helper';
import { Scan } from './Scan';
import { ScanSettings } from './ScanSettings';
import { ScanError } from './ScanError';
import { ScanResult } from './ScanResult';
import { Result } from 'neverthrow';
import { ScanJobDTO } from 'history-scanner-dto';
export declare class ScanJob {
    readonly url: Url;
    readonly latestScannedLedger: number;
    readonly latestScannedLedgerHeaderHash: string | null;
    readonly chainInitDate: Date | null;
    readonly fromLedger: number;
    readonly toLedger: number | null;
    readonly concurrency: number;
    readonly remoteId: string | null;
    private constructor();
    static fromScanJobCoordinatorDTO(dto: ScanJobDTO): Result<ScanJob, Error>;
    static continueScanChain(previousScan: Scan, toLedger?: number | null, concurrency?: number): ScanJob;
    static newScanChain(url: Url, fromLedger?: number, toLedger?: number | null, concurrency?: number): ScanJob;
    isNewScanChainJob(): boolean;
    createFailedScanCouldNotDetermineSettings(startDate: Date, endDate: Date, error: ScanError): Scan;
    createScanFromScanResult(startDate: Date, endDate: Date, settings: ScanSettings, scanResult: ScanResult): Scan;
}
//# sourceMappingURL=ScanJob.d.ts.map