import { Message } from '../Message';
import { OverlayEvent } from '../../overlay/event/OverlayEvent';
export declare class MessageReceived extends OverlayEvent {
    readonly message: Message;
    subType: string;
    constructor(message: Message);
    toString(): string;
}
//# sourceMappingURL=MessageReceived.d.ts.map