import { xdr } from '@stellar/stellar-base';
import { Result } from 'neverthrow';
export interface ExternalizeData {
    publicKey: string;
    slotIndex: bigint;
    value: string;
    closeTime: Date;
}
export declare function mapExternalizeStatement(externalizeStatement: xdr.ScpStatement): Result<ExternalizeData, Error>;
//# sourceMappingURL=map-externalize-statement.d.ts.map