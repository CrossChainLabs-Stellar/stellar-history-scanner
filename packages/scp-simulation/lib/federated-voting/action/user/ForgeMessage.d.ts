import { ProtocolAction, UserAction } from '../../../core';
import { FederatedVotingContext } from '../../FederatedVotingContext';
import { Message } from '../../Message';
export declare class ForgeMessage extends UserAction {
    readonly message: Message;
    subType: string;
    immediateExecution: boolean;
    readonly publicKey: string;
    constructor(message: Message);
    execute(context: FederatedVotingContext): ProtocolAction[];
    toString(): string;
    toJSON(): object;
    static fromJSON(json: any): ForgeMessage;
}
//# sourceMappingURL=ForgeMessage.d.ts.map