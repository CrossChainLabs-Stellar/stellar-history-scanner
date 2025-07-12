import { Scanner } from '../../domain/scanner/Scanner';
import { ScanCoordinatorService } from '../../domain/scan/ScanCoordinatorService';
import { ExceptionLogger } from 'exception-logger';
import { VerifyArchivesDTO } from './VerifyArchivesDTO';
import { JobMonitor } from 'job-monitor';
export declare class VerifyArchives {
    private scanner;
    private scanCoordinator;
    private exceptionLogger;
    private jobMonitor;
    constructor(scanner: Scanner, scanCoordinator: ScanCoordinatorService, exceptionLogger: ExceptionLogger, jobMonitor: JobMonitor);
    execute(verifyArchivesDTO: VerifyArchivesDTO): Promise<void>;
    private performScanJob;
    private perform;
    private persist;
    private checkIn;
}
//# sourceMappingURL=VerifyArchives.d.ts.map