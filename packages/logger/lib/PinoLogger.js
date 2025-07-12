"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinoLogger = void 0;
const pino_1 = require("pino");
class PinoLogger {
    pino;
    constructor(logLevel = 'info') {
        this.pino = (0, pino_1.pino)({
            level: logLevel,
            base: undefined
        });
    }
    getRawLogger() {
        return this.pino;
    }
    debug = (message, context) => {
        this.forward('debug', message, context);
    };
    trace = (message, context) => {
        this.forward('trace', message, context);
    };
    info = (message, context) => {
        this.forward('info', message, context);
    };
    warn = (message, context) => {
        this.forward('warn', message, context);
    };
    error = (message, context) => {
        this.forward('error', message, context);
    };
    fatal = (message, context) => {
        this.forward('fatal', message, context);
    };
    forward(method, message, context) {
        if (context) {
            // @ts-ignore
            this.pino[method](context, message);
        }
        else {
            // @ts-ignore
            this.pino[method](message);
        }
    }
}
exports.PinoLogger = PinoLogger;
