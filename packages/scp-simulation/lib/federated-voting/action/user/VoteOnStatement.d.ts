import { UserAction, ProtocolAction } from '../../../core';
import { Statement } from '../../../federated-voting/protocol';
import { FederatedVotingContext } from '../../FederatedVotingContext';
export declare class VoteOnStatement extends UserAction {
    readonly publicKey: string;
    readonly statement: Statement;
    subType: string;
    immediateExecution: boolean;
    constructor(publicKey: string, statement: Statement);
    execute(context: FederatedVotingContext): ProtocolAction[];
    toString(): string;
    toJSON(): object;
    static fromJSON(json: any): VoteOnStatement;
}
//# sourceMappingURL=VoteOnStatement.d.ts.map