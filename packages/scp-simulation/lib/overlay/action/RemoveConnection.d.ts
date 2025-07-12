import { Context, ProtocolAction, UserAction } from '../../core';
import { PublicKey } from '../Overlay';
export declare class RemoveConnection extends UserAction {
    readonly a: PublicKey;
    readonly b: PublicKey;
    readonly subType = "RemoveConnection";
    readonly immediateExecution = true;
    readonly publicKey: PublicKey;
    constructor(a: PublicKey, b: PublicKey);
    execute(context: Context): ProtocolAction[];
    toString(): string;
    toJSON(): object;
    static fromJSON(json: any): RemoveConnection;
}
//# sourceMappingURL=RemoveConnection.d.ts.map