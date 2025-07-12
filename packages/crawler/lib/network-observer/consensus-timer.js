"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsensusTimer = void 0;
class ConsensusTimer {
    timer;
    consensusTimeoutMS;
    constructor(timer, consensusTimeoutMS) {
        this.timer = timer;
        this.consensusTimeoutMS = consensusTimeoutMS;
    }
    start(callback) {
        this.timer.start(this.consensusTimeoutMS, callback);
    }
    stop() {
        this.timer.stopTimer();
    }
}
exports.ConsensusTimer = ConsensusTimer;
