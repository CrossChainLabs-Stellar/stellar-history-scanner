export declare enum ScanErrorType {
    TYPE_VERIFICATION = 0,
    TYPE_CONNECTION = 1
}
export declare class ScanError implements Error {
    readonly name = "ScanError";
    readonly type: ScanErrorType;
    readonly url: string;
    readonly message: string;
    constructor(type: ScanErrorType, url: string, message: string);
    equals(other: this): boolean;
}
//# sourceMappingURL=ScanError.d.ts.map