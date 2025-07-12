"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerFactory = void 0;
const timer_1 = require("./timer");
class TimerFactory {
    createTimer() {
        return new timer_1.Timer();
    }
}
exports.TimerFactory = TimerFactory;
