export type QuorumSetHash = string;
export declare class QuorumSetState {
    quorumSetOwners: Map<string, Set<string>>;
    quorumSetRequestedTo: Map<string, Set<string>>;
    quorumSetHashesInProgress: Set<string>;
    quorumSetRequests: Map<string, {
        timeout: NodeJS.Timeout;
        hash: QuorumSetHash;
    }>;
}
//# sourceMappingURL=quorum-set-state.d.ts.map