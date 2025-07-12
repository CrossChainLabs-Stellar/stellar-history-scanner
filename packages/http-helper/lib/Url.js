"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Url = void 0;
const neverthrow_1 = require("neverthrow");
const validator_1 = __importDefault(require("validator"));
class Url {
    value;
    constructor(url) {
        this.value = url;
    }
    static create(url) {
        if (!validator_1.default.isURL(url))
            return (0, neverthrow_1.err)(new Error('Url is not a proper url: ' + url));
        url = url.replace(/\/$/, ''); //remove trailing slash
        return (0, neverthrow_1.ok)(new Url(url));
    }
}
exports.Url = Url;
