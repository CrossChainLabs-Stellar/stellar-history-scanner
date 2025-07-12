"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    cause;
    errorType = 'CustomError'; //to allow type inference in err() result
    constructor(message, name, cause) {
        super(message);
        this.cause = cause;
        this.message = CustomError.getExtendedMessage(name, message, cause);
        this.cause = cause;
        this.name = name;
    }
    static getExtendedMessage(name, message, cause) {
        let extendedMessage = name + ': ' + message;
        if (cause instanceof CustomError)
            extendedMessage += ' => ' + cause.message;
        else if (cause)
            extendedMessage += ' => ' + cause.name + ': ' + cause.message;
        return extendedMessage;
    }
}
exports.CustomError = CustomError;
