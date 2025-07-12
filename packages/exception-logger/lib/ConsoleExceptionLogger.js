"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleExceptionLogger = void 0;
class ConsoleExceptionLogger {
    captureException(error) {
        console.log('Captured exception', error);
    }
}
exports.ConsoleExceptionLogger = ConsoleExceptionLogger;
