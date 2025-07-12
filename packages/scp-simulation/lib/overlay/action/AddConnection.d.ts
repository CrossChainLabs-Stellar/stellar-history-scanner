import { Context, ProtocolAction, UserAction } from '../../core';
import { PublicKey } from '../Overlay';
export declare class AddConnection extends UserAction {
    readonly a: PublicKey;
    readonly b: PublicKey;
    readonly subType = "AddConnection";
    readonly immediateExecution = true;
    readonly publicKey: PublicKey;
    constructor(a: PublicKey, b: PublicKey);
    execute(context: Context): ProtocolAction[];
    toString(): string;
    toJSON(): object;
    static fromJSON(json: any): AddConnection;
}
//# sourceMappingURL=AddConnection.d.ts.map