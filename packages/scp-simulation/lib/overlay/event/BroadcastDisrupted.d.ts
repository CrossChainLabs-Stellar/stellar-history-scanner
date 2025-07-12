import { Payload, PublicKey } from '../Overlay';
import { OverlayEvent } from './OverlayEvent';
export declare class BroadcastDisrupted extends OverlayEvent {
    readonly broadcaster: PublicKey;
    readonly neighbor: PublicKey;
    readonly payload: Payload;
    subType: string;
    constructor(broadcaster: PublicKey, neighbor: PublicKey, payload: Payload);
    toString(): string;
}
//# sourceMappingURL=BroadcastDisrupted.d.ts.map