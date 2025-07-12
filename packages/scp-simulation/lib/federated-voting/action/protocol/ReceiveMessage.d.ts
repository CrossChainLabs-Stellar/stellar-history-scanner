import { Message } from '../../Message';
import { Context, ProtocolAction } from '../../../core';
export declare class ReceiveMessage extends ProtocolAction {
    readonly message: Message;
    subType: string;
    readonly publicKey: string;
    constructor(message: Message);
    execute(context: Context): ProtocolAction[];
    toString(): string;
    toJSON(): object;
    static fromJSON(json: any): ReceiveMessage;
}
//# sourceMappingURL=ReceiveMessage.d.ts.map