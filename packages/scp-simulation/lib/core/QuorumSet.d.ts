export declare class QuorumSet {
    readonly threshold: number;
    readonly validators: ReadonlyArray<string>;
    readonly innerQuorumSets: QuorumSet[];
    constructor(threshold: number, validators: ReadonlyArray<string>, innerQuorumSets: QuorumSet[]);
    toJSON(): Record<string, unknown>;
    static fromJSON(json: Record<string, unknown>): QuorumSet;
}
//# sourceMappingURL=QuorumSet.d.ts.map