import { Payload, PublicKey } from '../Overlay';
import { OverlayEvent } from './OverlayEvent';
export declare class BroadcastFailed extends OverlayEvent {
    readonly broadcaster: PublicKey;
    readonly payload: Payload;
    subType: string;
    constructor(broadcaster: PublicKey, payload: Payload);
    toString(): string;
}
//# sourceMappingURL=BroadcastFailed.d.ts.map