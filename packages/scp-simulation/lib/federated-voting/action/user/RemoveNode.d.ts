import { Context, ProtocolAction, UserAction } from '../../../core';
export declare class RemoveNode extends UserAction {
    readonly publicKey: string;
    subType: string;
    immediateExecution: boolean;
    constructor(publicKey: string);
    execute(context: Context): ProtocolAction[];
    toString(): string;
    toJSON(): object;
    static fromJSON(json: any): RemoveNode;
}
//# sourceMappingURL=RemoveNode.d.ts.map