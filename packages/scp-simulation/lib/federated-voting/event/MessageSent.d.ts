import { Message } from '../Message';
import { OverlayEvent } from '../../overlay/event/OverlayEvent';
export declare class MessageSent extends OverlayEvent {
    readonly message: Message;
    subType: string;
    constructor(message: Message);
    toString(): string;
}
//# sourceMappingURL=MessageSent.d.ts.map