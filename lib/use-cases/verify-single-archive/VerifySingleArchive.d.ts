import { Result } from 'neverthrow';
import { Scanner } from '../../domain/scanner/Scanner';
import { ExceptionLogger } from 'exception-logger';
import { VerifySingleArchiveDTO } from './VerifySingleArchiveDTO';
export declare class VerifySingleArchive {
    private scanner;
    private exceptionLogger;
    constructor(scanner: Scanner, exceptionLogger: ExceptionLogger);
    execute(verifySingleArchiveDTO: VerifySingleArchiveDTO): Promise<Result<void, Error>>;
    private static getArchiveUrl;
    private scanArchive;
}
//# sourceMappingURL=VerifySingleArchive.d.ts.map