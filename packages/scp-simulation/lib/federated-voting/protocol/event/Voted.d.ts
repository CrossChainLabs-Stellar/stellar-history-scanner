import { PublicKey } from '../../../core';
import { ProtocolEvent } from './ProtocolEvent';
import { Vote } from '../Vote';
export declare class Voted extends ProtocolEvent {
    readonly publicKey: PublicKey;
    readonly vote: Vote;
    readonly subType = "Voted";
    constructor(publicKey: PublicKey, vote: Vote);
    toString(): string;
}
//# sourceMappingURL=Voted.d.ts.map