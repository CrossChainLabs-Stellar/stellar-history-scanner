"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = load;
const Scanner_1 = require("../../domain/scanner/Scanner");
const HASValidator_1 = require("../../domain/history-archive/HASValidator");
const CheckPointGenerator_1 = require("../../domain/check-point/CheckPointGenerator");
const di_types_1 = require("./di-types");
const StandardCheckPointFrequency_1 = require("../../domain/check-point/StandardCheckPointFrequency");
const CategoryScanner_1 = require("../../domain/scanner/CategoryScanner");
const BucketScanner_1 = require("../../domain/scanner/BucketScanner");
const RangeScanner_1 = require("../../domain/scanner/RangeScanner");
const VerifyArchives_1 = require("../../use-cases/verify-archives/VerifyArchives");
const ArchivePerformanceTester_1 = require("../../domain/scanner/ArchivePerformanceTester");
const ScanSettingsFactory_1 = require("../../domain/scan/ScanSettingsFactory");
const CategoryVerificationService_1 = require("../../domain/scanner/CategoryVerificationService");
const http_helper_1 = require("http-helper");
const RESTScanCoordinatorService_1 = require("../services/RESTScanCoordinatorService");
const job_monitor_1 = require("job-monitor");
const exception_logger_1 = require("exception-logger");
const logger_1 = require("logger");
const VerifySingleArchive_1 = require("../../use-cases/verify-single-archive/VerifySingleArchive");
function load(container, config) {
    container.bind(CategoryScanner_1.CategoryScanner).toSelf();
    container.bind(BucketScanner_1.BucketScanner).toSelf();
    container.bind(HASValidator_1.HASValidator).toSelf();
    container.bind(Scanner_1.Scanner).toSelf();
    container.bind(RangeScanner_1.RangeScanner).toSelf();
    container.bind(VerifyArchives_1.VerifyArchives).toSelf();
    container.bind(VerifySingleArchive_1.VerifySingleArchive).toSelf();
    container.bind(CheckPointGenerator_1.CheckPointGenerator).toSelf();
    container.bind(CategoryVerificationService_1.CategoryVerificationService).toSelf();
    container.bind(ScanSettingsFactory_1.ScanSettingsFactory).toDynamicValue(() => {
        return new ScanSettingsFactory_1.ScanSettingsFactory(container.get(CategoryScanner_1.CategoryScanner), container.get(ArchivePerformanceTester_1.ArchivePerformanceTester), config.historySlowArchiveMaxLedgers);
    });
    container
        .bind(ArchivePerformanceTester_1.ArchivePerformanceTester)
        .toDynamicValue(() => new ArchivePerformanceTester_1.ArchivePerformanceTester(container.get(CheckPointGenerator_1.CheckPointGenerator), container.get(di_types_1.TYPES.HttpQueue), config.historyMaxFileMs));
    container
        .bind(di_types_1.TYPES.CheckPointFrequency)
        .toDynamicValue(() => {
        return new StandardCheckPointFrequency_1.StandardCheckPointFrequency();
    });
    container
        .bind(di_types_1.TYPES.ScanCoordinatorService)
        .toDynamicValue(() => {
        return new RESTScanCoordinatorService_1.RESTScanCoordinatorService(container.get(di_types_1.TYPES.HttpService), config.coordinatorAPIBaseUrl, config.coordinatorAPIUsername, config.coordinatorAPIPassword);
    });
    container.bind(di_types_1.TYPES.ExceptionLogger).toDynamicValue(() => {
        if (config.enableSentry && config.sentryDSN)
            return new exception_logger_1.SentryExceptionLogger(config.sentryDSN, container.get('Logger'));
        else
            return new exception_logger_1.ConsoleExceptionLogger();
    });
    container
        .bind('Logger')
        .toDynamicValue(() => {
        return new logger_1.PinoLogger(config.logLevel);
    })
        .inSingletonScope();
    container.bind(di_types_1.TYPES.JobMonitor).toDynamicValue(() => {
        if (config.enableSentry && config.sentryDSN)
            return new job_monitor_1.SentryJobMonitor(config.sentryDSN);
        return new job_monitor_1.LoggerJobMonitor(container.get('Logger'));
    });
    container.bind(di_types_1.TYPES.HttpService).toDynamicValue(() => {
        return new http_helper_1.AxiosHttpService(config.userAgent);
    });
    container.bind(di_types_1.TYPES.HttpQueue).toDynamicValue(() => {
        return new http_helper_1.HttpQueue(container.get(di_types_1.TYPES.HttpService), container.get('Logger'));
    });
}
