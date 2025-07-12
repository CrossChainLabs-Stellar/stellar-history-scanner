import { PublicKey } from '../../../../core';
import { FederatedVotingPhase } from '../../FederatedVotingProtocolState';
import { ProtocolEvent } from '../../event/ProtocolEvent';
import { Statement } from '../../Statement';
export declare class TransitionedToAcceptPhase extends ProtocolEvent {
    readonly publicKey: PublicKey;
    readonly phase: FederatedVotingPhase;
    readonly statement: Statement;
    readonly subType = "TransitionedToAcceptPhase";
    constructor(publicKey: PublicKey, phase: FederatedVotingPhase, statement: Statement);
    toString(): string;
}
//# sourceMappingURL=TransitionedToAcceptPhase.d.ts.map