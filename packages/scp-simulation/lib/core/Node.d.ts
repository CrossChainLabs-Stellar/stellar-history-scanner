import { QuorumSet } from './QuorumSet';
export declare class Node {
    readonly publicKey: string;
    private _quorumSet;
    constructor(publicKey: string, quorumSet: QuorumSet);
    updateQuorumSet(quorumSet: QuorumSet): void;
    get quorumSet(): QuorumSet;
    toJSON(): Record<string, unknown>;
    static fromJSON(json: Record<string, unknown>): Node;
}
//# sourceMappingURL=Node.d.ts.map