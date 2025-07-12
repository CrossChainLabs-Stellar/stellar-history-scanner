import { Context, ProtocolAction, QuorumSet, UserAction } from '../../../core';
export declare class AddNode extends UserAction {
    readonly publicKey: string;
    readonly quorumSet: QuorumSet;
    subType: string;
    immediateExecution: boolean;
    constructor(publicKey: string, quorumSet: QuorumSet);
    execute(context: Context): ProtocolAction[];
    toString(): string;
    toJSON(): object;
    static fromJSON(json: any): AddNode;
}
//# sourceMappingURL=AddNode.d.ts.map