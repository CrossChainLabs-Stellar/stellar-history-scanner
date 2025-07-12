import { PublicKey } from '../../../../core';
import { ProtocolEvent } from '../../event/ProtocolEvent';
import { Statement } from '../../Statement';
export declare class AcceptVoteVBlocked extends ProtocolEvent {
    readonly publicKey: PublicKey;
    readonly statement: Statement;
    readonly vBlockingSet: Set<PublicKey>;
    readonly subType = "AcceptVoteVBlocked";
    constructor(publicKey: PublicKey, statement: Statement, vBlockingSet: Set<PublicKey>);
    toString(): string;
}
//# sourceMappingURL=AcceptVoteVBlocked.d.ts.map