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
exports.CheckPointGenerator = void 0;
const inversify_1 = require("inversify");
const di_types_1 = require("../../infrastructure/di/di-types");
require("reflect-metadata");
let CheckPointGenerator = class CheckPointGenerator {
    checkPointFrequency;
    constructor(checkPointFrequency) {
        this.checkPointFrequency = checkPointFrequency;
    }
    *generate(fromLedger, toLedger) {
        let checkPoint = this.getClosestHigherCheckPoint(fromLedger);
        while (checkPoint <= toLedger) {
            yield checkPoint;
            checkPoint += 64;
        }
    }
    getClosestHigherCheckPoint(ledger) {
        return (Math.floor((ledger + this.checkPointFrequency.get()) /
            this.checkPointFrequency.get()) *
            this.checkPointFrequency.get() -
            1);
    }
};
exports.CheckPointGenerator = CheckPointGenerator;
exports.CheckPointGenerator = CheckPointGenerator = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(di_types_1.TYPES.CheckPointFrequency)),
    __metadata("design:paramtypes", [Object])
], CheckPointGenerator);
