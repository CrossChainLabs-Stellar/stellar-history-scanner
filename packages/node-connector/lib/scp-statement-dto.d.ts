import { xdr } from '@stellar/stellar-base';
import { Result } from 'neverthrow';
export type ScpStatementPledges = ScpStatementPrepare | ScpStatementConfirm | ScpStatementExternalize | ScpNomination;
export interface ScpStatementConfirm {
    ballot: ScpBallot;
    nPrepared: number;
    nCommit: number;
    nH: number;
    quorumSetHash: string;
}
export interface ScpStatementPrepare {
    quorumSetHash: string;
    ballot: ScpBallot;
    prepared: null | ScpBallot;
    preparedPrime: null | ScpBallot;
    nC: number;
    nH: number;
}
export interface ScpBallot {
    counter: number;
    value: string;
}
export interface ScpStatementExternalize {
    quorumSetHash: string;
    nH: number;
    commit: ScpBallot;
}
export interface ScpNomination {
    quorumSetHash: string;
    votes: string[];
    accepted: string[];
}
export type SCPStatementType = 'externalize' | 'nominate' | 'confirm' | 'prepare';
export declare class SCPStatement {
    nodeId: string;
    slotIndex: string;
    type: SCPStatementType;
    pledges: ScpStatementPledges;
    constructor(nodeId: string, slotIndex: string, type: SCPStatementType, pledges: ScpStatementPledges);
    static fromXdr(xdrInput: string | xdr.ScpStatement): Result<SCPStatement, Error>;
}
//# sourceMappingURL=scp-statement-dto.d.ts.map