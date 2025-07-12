import { Message } from '../Message';
import { OverlayEvent } from '../../overlay/event/OverlayEvent';
export declare class ForgedMessageSent extends OverlayEvent {
    readonly message: Message;
    subType: string;
    constructor(message: Message);
    toString(): string;
}
//# sourceMappingURL=ForgedMessageSent.d.ts.map