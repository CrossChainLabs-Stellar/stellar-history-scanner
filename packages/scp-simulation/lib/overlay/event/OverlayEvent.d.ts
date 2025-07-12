import { Event } from '../../core';
export declare abstract class OverlayEvent implements Event {
    readonly publicKey: string;
    type: string;
    abstract readonly subType: string;
    constructor(publicKey: string);
    abstract toString(): string;
}
//# sourceMappingURL=OverlayEvent.d.ts.map