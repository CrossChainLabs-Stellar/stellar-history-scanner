import { NodeStatisticsV1 } from "./dto/node-v1";
export declare class NodeStatistics {
    active30DaysPercentage: number;
    overLoaded30DaysPercentage: number;
    validating30DaysPercentage: number;
    active24HoursPercentage: number;
    overLoaded24HoursPercentage: number;
    validating24HoursPercentage: number;
    has30DayStats: boolean;
    has24HourStats: boolean;
    toJSON(): Record<string, unknown>;
    static fromNodeStatisticsV1(nodeStatisticsV1: NodeStatisticsV1): NodeStatistics;
}
//# sourceMappingURL=node-statistics.d.ts.map