"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxCrawlTimeManager = void 0;
class MaxCrawlTimeManager {
    timer;
    setTimer(maxCrawlTime, onMaxCrawlTime) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(onMaxCrawlTime, maxCrawlTime);
    }
    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
}
exports.MaxCrawlTimeManager = MaxCrawlTimeManager;
