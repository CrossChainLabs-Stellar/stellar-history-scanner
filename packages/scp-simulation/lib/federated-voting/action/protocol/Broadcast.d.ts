import { Context, ProtocolAction, PublicKey } from '../../../core';
import { Payload } from '../../../overlay/Overlay';
export declare class Broadcast extends ProtocolAction {
    readonly broadcaster: PublicKey;
    readonly payload: Payload;
    private neighborBlackList;
    subType: string;
    readonly publicKey: string;
    constructor(broadcaster: PublicKey, payload: Payload, neighborBlackList?: PublicKey[]);
    execute(context: Context): ProtocolAction[];
    blackListNeighbors(neighbors: PublicKey[]): void;
    getBlackList(): PublicKey[];
    toString(): string;
    toJSON(): object;
    static fromJSON(json: any): Broadcast;
}
//# sourceMappingURL=Broadcast.d.ts.map