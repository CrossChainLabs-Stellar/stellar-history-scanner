"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeStatistics = void 0;
class NodeStatistics {
    active30DaysPercentage = 0;
    overLoaded30DaysPercentage = 0;
    validating30DaysPercentage = 0;
    active24HoursPercentage = 0;
    overLoaded24HoursPercentage = 0;
    validating24HoursPercentage = 0;
    has30DayStats = false;
    has24HourStats = false;
    toJSON() {
        return {
            active30DaysPercentage: this.active30DaysPercentage,
            overLoaded30DaysPercentage: this.overLoaded30DaysPercentage,
            validating30DaysPercentage: this.validating30DaysPercentage,
            active24HoursPercentage: this.active24HoursPercentage,
            overLoaded24HoursPercentage: this.overLoaded24HoursPercentage,
            validating24HoursPercentage: this.validating24HoursPercentage,
            has24HourStats: this.has24HourStats,
            has30DayStats: this.has30DayStats
        };
    }
    static fromNodeStatisticsV1(nodeStatisticsV1) {
        const newNodeStatistics = new NodeStatistics();
        newNodeStatistics.active30DaysPercentage =
            nodeStatisticsV1.active30DaysPercentage;
        newNodeStatistics.overLoaded30DaysPercentage =
            nodeStatisticsV1.overLoaded30DaysPercentage;
        newNodeStatistics.validating30DaysPercentage =
            nodeStatisticsV1.validating30DaysPercentage;
        newNodeStatistics.active24HoursPercentage =
            nodeStatisticsV1.active24HoursPercentage;
        newNodeStatistics.overLoaded24HoursPercentage =
            nodeStatisticsV1.overLoaded24HoursPercentage;
        newNodeStatistics.validating24HoursPercentage =
            nodeStatisticsV1.validating24HoursPercentage;
        newNodeStatistics.has30DayStats = nodeStatisticsV1.has30DayStats;
        newNodeStatistics.has24HourStats = nodeStatisticsV1.has24HourStats;
        return newNodeStatistics;
    }
}
exports.NodeStatistics = NodeStatistics;
