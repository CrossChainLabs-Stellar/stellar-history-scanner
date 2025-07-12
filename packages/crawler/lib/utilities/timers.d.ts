import { TimerFactory } from './timer-factory';
export declare class Timers {
    private timerFactory;
    private timers;
    constructor(timerFactory: TimerFactory);
    startTimer(time: number, callback: () => void): void;
    stopTimers(): void;
    hasActiveTimers(): boolean;
}
//# sourceMappingURL=timers.d.ts.map