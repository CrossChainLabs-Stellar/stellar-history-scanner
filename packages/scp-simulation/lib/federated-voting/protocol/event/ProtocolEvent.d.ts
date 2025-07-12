import { Event } from '../../../core';
export declare abstract class ProtocolEvent implements Event {
    readonly publicKey: string;
    type: string;
    abstract readonly subType: string;
    constructor(publicKey: string);
    abstract toString(): string;
}
//# sourceMappingURL=ProtocolEvent.d.ts.map