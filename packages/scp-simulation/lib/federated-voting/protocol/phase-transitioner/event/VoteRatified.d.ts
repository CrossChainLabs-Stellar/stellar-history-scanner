import { PublicKey } from '../../../../core';
import { QuorumSet } from '../../../../core/QuorumSet';
import { ProtocolEvent } from '../../event/ProtocolEvent';
import { Statement } from '../../Statement';
export declare class VoteRatified extends ProtocolEvent {
    readonly publicKey: PublicKey;
    readonly statement: Statement;
    readonly quorum: Map<string, QuorumSet>;
    readonly subType = "VoteRatified";
    constructor(publicKey: PublicKey, statement: Statement, quorum: Map<string, QuorumSet>);
    toString(): string;
}
//# sourceMappingURL=VoteRatified.d.ts.map