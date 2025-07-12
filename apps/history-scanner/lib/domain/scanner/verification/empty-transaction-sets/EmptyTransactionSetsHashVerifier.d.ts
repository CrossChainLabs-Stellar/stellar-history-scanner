import 'reflect-metadata';
import { Result } from 'neverthrow';
export declare class EmptyTransactionSetsHashVerifier {
    static verify(ledger: number, protocolVersion: number, previousLedgerHeaderHash: string, expectedHash: string): Result<boolean, Error>;
}
//# sourceMappingURL=EmptyTransactionSetsHashVerifier.d.ts.map