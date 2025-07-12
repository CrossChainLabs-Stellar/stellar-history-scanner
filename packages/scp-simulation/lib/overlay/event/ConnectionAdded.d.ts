import { PublicKey } from '../Overlay';
import { OverlayEvent } from './OverlayEvent';
export declare class ConnectionAdded extends OverlayEvent {
    readonly a: PublicKey;
    readonly b: PublicKey;
    subType: string;
    constructor(a: PublicKey, b: PublicKey);
    toString(): string;
}
//# sourceMappingURL=ConnectionAdded.d.ts.map