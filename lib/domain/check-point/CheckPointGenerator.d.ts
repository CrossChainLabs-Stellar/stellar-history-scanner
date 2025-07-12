import { CheckPointFrequency } from './CheckPointFrequency';
import 'reflect-metadata';
export type CheckPoint = number;
export declare class CheckPointGenerator {
    checkPointFrequency: CheckPointFrequency;
    constructor(checkPointFrequency: CheckPointFrequency);
    generate(fromLedger: number, toLedger: number): IterableIterator<CheckPoint>;
    getClosestHigherCheckPoint(ledger: number): CheckPoint;
}
//# sourceMappingURL=CheckPointGenerator.d.ts.map