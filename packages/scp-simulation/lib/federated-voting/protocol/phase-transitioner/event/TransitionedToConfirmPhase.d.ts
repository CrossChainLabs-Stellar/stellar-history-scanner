import { PublicKey } from '../../../../core';
import { FederatedVotingPhase } from '../../FederatedVotingProtocolState';
import { ProtocolEvent } from '../../event/ProtocolEvent';
import { Statement } from '../../Statement';
export declare class TransitionedToConfirmPhase extends ProtocolEvent {
    readonly publicKey: PublicKey;
    readonly phase: FederatedVotingPhase;
    readonly statement: Statement;
    readonly subType = "TransitionedToConfirmPhase";
    constructor(publicKey: PublicKey, phase: FederatedVotingPhase, statement: Statement);
    toString(): string;
}
//# sourceMappingURL=TransitionedToConfirmPhase.d.ts.map