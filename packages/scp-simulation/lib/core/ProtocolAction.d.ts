import { Context } from './Context';
export declare abstract class ProtocolAction {
    readonly type = "ProtocolAction";
    abstract readonly subType: string;
    abstract readonly publicKey: string;
    isDisrupted: boolean;
    abstract execute(context: Context): ProtocolAction[];
    abstract toString(): string;
    abstract toJSON(): object;
}
//# sourceMappingURL=ProtocolAction.d.ts.map