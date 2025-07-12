import { UserAction, ProtocolAction, QuorumSet, Context } from '../../../core';
export declare class UpdateQuorumSet extends UserAction {
    readonly publicKey: string;
    readonly quorumSet: QuorumSet;
    subType: string;
    immediateExecution: boolean;
    constructor(publicKey: string, quorumSet: QuorumSet);
    execute(context: Context): ProtocolAction[];
    toString(): string;
    toJSON(): object;
    static fromJSON(json: any): UpdateQuorumSet;
}
//# sourceMappingURL=UpdateQuorumSet.d.ts.map