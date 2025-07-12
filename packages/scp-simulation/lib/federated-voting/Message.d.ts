import { PublicKey } from '..';
import { Vote } from './protocol/Vote';
export declare class Message {
    readonly sender: PublicKey;
    readonly receiver: PublicKey;
    readonly vote: Vote;
    constructor(sender: PublicKey, receiver: PublicKey, vote: Vote);
    toString(): string;
    toJSON(): object;
    static fromJSON(json: any): Message;
}
//# sourceMappingURL=Message.d.ts.map