import { PublicKey, QuorumSet } from '../../../../core';
import { ProtocolEvent } from '../../event/ProtocolEvent';
import { Statement } from '../../Statement';
export declare class AcceptVoteRatified extends ProtocolEvent {
    readonly publicKey: PublicKey;
    readonly statement: Statement;
    readonly quorum: Map<string, QuorumSet>;
    readonly subType = "AcceptVoteRatified";
    constructor(publicKey: PublicKey, statement: Statement, quorum: Map<string, QuorumSet>);
    toString(): string;
}
//# sourceMappingURL=AcceptVoteRatified.d.ts.map