"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyArchives = void 0;
const Scanner_1 = require("../../domain/scanner/Scanner");
const shared_1 = require("shared");
const shared_2 = require("shared");
const ScanJob_1 = require("../../domain/scan/ScanJob");
const inversify_1 = require("inversify");
const di_types_1 = require("../../infrastructure/di/di-types");
let VerifyArchives = class VerifyArchives {
    scanner;
    scanCoordinator;
    exceptionLogger;
    jobMonitor;
    constructor(scanner, scanCoordinator, exceptionLogger, jobMonitor) {
        this.scanner = scanner;
        this.scanCoordinator = scanCoordinator;
        this.exceptionLogger = exceptionLogger;
        this.jobMonitor = jobMonitor;
    }
    async execute(verifyArchivesDTO) {
        const shutDown = false; //todo: implement graceful shutdown
        console.log('execute');
        do {
            try {
                const scanJobDTOResult = await this.scanCoordinator.getScanJob();
                if (scanJobDTOResult.isErr()) {
                    this.exceptionLogger.captureException(scanJobDTOResult.error);
                    await (0, shared_2.asyncSleep)(60 * 1000); //maybe temporary db connection error
                    continue;
                }
                await this.performScanJob(scanJobDTOResult.value, verifyArchivesDTO.persist);
            }
            catch (e) {
                //general catch all in case we missed an edge case
                this.exceptionLogger.captureException((0, shared_1.mapUnknownToError)(e));
                await (0, shared_2.asyncSleep)(60 * 1000);
            }
        } while (!shutDown && verifyArchivesDTO.loop);
    }
    async performScanJob(dto, persist = false) {
        const scanJobResult = ScanJob_1.ScanJob.fromScanJobCoordinatorDTO(dto);
        if (scanJobResult.isErr()) {
            this.exceptionLogger.captureException(scanJobResult.error);
            return;
        }
        await this.checkIn('in_progress');
        await this.perform(scanJobResult.value, persist);
        await this.checkIn('ok');
    }
    async perform(scanJob, persist = false) {
        const scan = await this.scanner.perform(new Date(), scanJob);
        console.log(scan);
        //todo: logger
        if (persist)
            await this.persist(scan);
    }
    async persist(scan) {
        const result = await this.scanCoordinator.registerScan(scan);
        if (result.isErr()) {
            this.exceptionLogger.captureException(result.error);
        }
    }
    async checkIn(status) {
        const result = await this.jobMonitor.checkIn({
            context: 'verify-archive',
            status
        });
        if (result.isErr()) {
            this.exceptionLogger.captureException(result.error);
        }
    }
};
VerifyArchives = __decorate([
    (0, inversify_1.injectable)(),
    __param(1, (0, inversify_1.inject)(di_types_1.TYPES.ScanCoordinatorService)),
    __param(2, (0, inversify_1.inject)(di_types_1.TYPES.ExceptionLogger)),
    __param(3, (0, inversify_1.inject)(di_types_1.TYPES.JobMonitor)),
    __metadata("design:paramtypes", [Scanner_1.Scanner, Object, Object, Object])
], VerifyArchives);
exports.VerifyArchives = VerifyArchives;
