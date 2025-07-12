import { Result } from 'neverthrow';
import { Logger } from 'logger';
import { HistoryArchiveState } from './HistoryArchiveState';
import { CustomError } from 'custom-error';
export declare class InvalidHASError extends CustomError {
    constructor(message: string);
}
export declare class HASValidator {
    protected logger: Logger;
    private readonly validateHistoryArchiveState;
    constructor(logger: Logger);
    validate(historyArchiveStateRaw: Record<string, unknown>): Result<HistoryArchiveState, InvalidHASError>;
}
//# sourceMappingURL=HASValidator.d.ts.map