interface ZLibError {
    errno: number;
    code: string;
    message: string;
}
export declare function isZLibError(error: unknown): error is ZLibError;
export {};
//# sourceMappingURL=isZLibError.d.ts.map