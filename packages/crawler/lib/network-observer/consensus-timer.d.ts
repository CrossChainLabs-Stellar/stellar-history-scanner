import { Timer } from '../utilities/timer';
export declare class ConsensusTimer {
    private timer;
    private consensusTimeoutMS;
    constructor(timer: Timer, consensusTimeoutMS: number);
    start(callback: () => void): void;
    stop(): void;
}
//# sourceMappingURL=consensus-timer.d.ts.map