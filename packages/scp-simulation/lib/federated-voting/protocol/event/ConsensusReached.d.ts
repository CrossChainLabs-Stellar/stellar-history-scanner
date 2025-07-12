import { PublicKey } from '../../../core';
import { ProtocolEvent } from './ProtocolEvent';
import { Statement } from '../Statement';
export declare class ConsensusReached extends ProtocolEvent {
    readonly publicKey: PublicKey;
    readonly statement: Statement;
    readonly subType = "ConsensusReached";
    constructor(publicKey: PublicKey, statement: Statement);
    toString(): string;
}
//# sourceMappingURL=ConsensusReached.d.ts.map