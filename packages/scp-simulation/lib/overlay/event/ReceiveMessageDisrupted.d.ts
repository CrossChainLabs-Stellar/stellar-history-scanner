import { Payload, PublicKey } from '../Overlay';
import { OverlayEvent } from './OverlayEvent';
export declare class ReceiveMessageDisrupted extends OverlayEvent {
    readonly receiver: PublicKey;
    readonly from: PublicKey;
    readonly payload: Payload;
    subType: string;
    constructor(receiver: PublicKey, from: PublicKey, payload: Payload);
    toString(): string;
}
//# sourceMappingURL=ReceiveMessageDisrupted.d.ts.map