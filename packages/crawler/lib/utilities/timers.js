"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timers = void 0;
class Timers {
    timerFactory;
    timers = new Set();
    constructor(timerFactory) {
        this.timerFactory = timerFactory;
    }
    startTimer(time, callback) {
        const timer = this.timerFactory.createTimer();
        const myCallback = () => {
            this.timers.delete(timer);
            callback();
        };
        timer.start(time, myCallback);
        this.timers.add(timer);
    }
    stopTimers() {
        this.timers.forEach((timer) => timer.stopTimer());
        this.timers = new Set();
    }
    hasActiveTimers() {
        return this.timers.size > 0;
    }
}
exports.Timers = Timers;
