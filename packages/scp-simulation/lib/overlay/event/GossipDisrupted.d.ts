import { Payload, PublicKey } from '../Overlay';
import { OverlayEvent } from './OverlayEvent';
export declare class GossipDisrupted extends OverlayEvent {
    readonly gossiper: PublicKey;
    readonly neighbor: PublicKey;
    readonly payload: Payload;
    subType: string;
    constructor(gossiper: PublicKey, neighbor: PublicKey, payload: Payload);
    toString(): string;
}
//# sourceMappingURL=GossipDisrupted.d.ts.map