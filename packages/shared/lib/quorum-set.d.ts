export interface BaseQuorumSet {
    threshold: number;
    validators: string[];
    innerQuorumSets: BaseQuorumSet[];
}
export declare class QuorumSet implements BaseQuorumSet {
    threshold: number;
    validators: string[];
    innerQuorumSets: QuorumSet[];
    constructor(threshold?: number, validators?: string[], innerQuorumSets?: QuorumSet[]);
    hasValidators(): boolean;
    static getAllValidators(qs: QuorumSet): string[];
    toJSON(): Record<string, unknown>;
    static fromBaseQuorumSet(quorumSetObject: BaseQuorumSet): QuorumSet;
}
//# sourceMappingURL=quorum-set.d.ts.map