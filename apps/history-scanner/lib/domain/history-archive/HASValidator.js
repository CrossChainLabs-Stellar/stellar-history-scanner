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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HASValidator = exports.InvalidHASError = void 0;
const neverthrow_1 = require("neverthrow");
const inversify_1 = require("inversify");
const ajv_1 = __importDefault(require("ajv"));
const HistoryArchiveState_1 = require("./HistoryArchiveState");
const custom_error_1 = require("custom-error");
class InvalidHASError extends custom_error_1.CustomError {
    constructor(message) {
        super('Invalid HAS file: ' + message, InvalidHASError.name);
    }
}
exports.InvalidHASError = InvalidHASError;
let HASValidator = class HASValidator {
    logger;
    validateHistoryArchiveState;
    constructor(logger) {
        this.logger = logger;
        const ajv = new ajv_1.default();
        this.validateHistoryArchiveState = ajv.compile(HistoryArchiveState_1.HistoryArchiveStateSchema); //todo this probably needs to move higher up the chain...
    }
    validate(historyArchiveStateRaw) {
        const validate = this.validateHistoryArchiveState;
        if (validate(historyArchiveStateRaw)) {
            return (0, neverthrow_1.ok)(historyArchiveStateRaw);
        }
        const errors = validate.errors;
        if (errors === undefined || errors === null)
            return (0, neverthrow_1.err)(new InvalidHASError('Unknown error'));
        return (0, neverthrow_1.err)(new InvalidHASError(errors.toString()));
    }
};
exports.HASValidator = HASValidator;
exports.HASValidator = HASValidator = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('Logger')),
    __metadata("design:paramtypes", [Object])
], HASValidator);
