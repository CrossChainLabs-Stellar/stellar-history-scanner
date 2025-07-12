import 'reflect-metadata';
import { CustomError } from 'custom-error';
import { HttpService } from 'http-helper';
import { Result } from 'neverthrow';
import { Scan } from 'src/domain/scan/Scan';
import { ScanJobDTO } from 'history-scanner-dto';
import { ScanCoordinatorService } from 'src/domain/scan/ScanCoordinatorService';
export declare class CoordinatorServiceError extends CustomError {
    constructor(message: string, cause?: Error);
}
export declare class RESTScanCoordinatorService implements ScanCoordinatorService {
    private readonly httpService;
    private readonly coordinatorAPIBaseUrl;
    private readonly coordinatorAPIUsername;
    private readonly coordinatorAPIPassword;
    constructor(httpService: HttpService, coordinatorAPIBaseUrl: string, coordinatorAPIUsername: string, coordinatorAPIPassword: string);
    registerScan(scan: Scan): Promise<Result<void, Error>>;
    private convertScanToDTO;
    getScanJob(): Promise<Result<ScanJobDTO, Error>>;
    private convertResponseToScanJobDTO;
}
//# sourceMappingURL=RESTScanCoordinatorService.d.ts.map