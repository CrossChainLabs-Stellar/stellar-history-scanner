import { PublicKey, QuorumSet } from '../../core';
import { Statement } from './Statement';
export declare class Vote {
    readonly statement: Statement;
    readonly isVoteToAccept: boolean;
    readonly publicKey: PublicKey;
    readonly quorumSet: QuorumSet;
    constructor(statement: Statement, // I voted for statement
    isVoteToAccept: boolean, //If false: I voted for the statement, else: an intact node voted for the statement
    publicKey: PublicKey, quorumSet: QuorumSet);
    toString(): string;
    hash(): string;
    toJSON(): object;
    static fromJSON(json: any): Vote;
}
//# sourceMappingURL=Vote.d.ts.map