export declare class CustomError extends Error {
    cause?: Error | undefined;
    errorType: string;
    constructor(message: string, name: string, cause?: Error | undefined);
    private static getExtendedMessage;
}
//# sourceMappingURL=CustomError.d.ts.map