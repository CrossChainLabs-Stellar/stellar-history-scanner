import { Context } from './Context';
import { ProtocolAction } from './ProtocolAction';
export declare abstract class UserAction {
    readonly type = "UserAction";
    abstract readonly publicKey: string;
    abstract readonly subType: string;
    abstract readonly immediateExecution: boolean;
    abstract execute(context: Context): ProtocolAction[];
    abstract toString(): string;
    abstract toJSON(): object;
}
//# sourceMappingURL=UserAction.d.ts.map