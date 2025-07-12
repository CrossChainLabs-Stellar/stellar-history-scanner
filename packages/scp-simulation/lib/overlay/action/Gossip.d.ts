import { Context, ProtocolAction } from '../../core';
import { Payload } from '../Overlay';
type PublicKey = string;
export declare class Gossip extends ProtocolAction {
    readonly sender: PublicKey;
    readonly payload: Payload;
    readonly subType = "Gossip";
    readonly publicKey: PublicKey;
    private neighborBlackList;
    constructor(sender: PublicKey, payload: Payload);
    execute(context: Context): ProtocolAction[];
    blackListNeighbors(neighbors: PublicKey[]): void;
    getBlackList(): PublicKey[];
    toString(): string;
    toJSON(): object;
    static fromJSON(json: any): Gossip;
}
export {};
//# sourceMappingURL=Gossip.d.ts.map