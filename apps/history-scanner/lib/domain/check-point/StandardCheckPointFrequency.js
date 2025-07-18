"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardCheckPointFrequency = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
let StandardCheckPointFrequency = class StandardCheckPointFrequency {
    //in the future the frequency could change
    get() {
        return 64; //if needed this could come from configuration
    }
};
exports.StandardCheckPointFrequency = StandardCheckPointFrequency;
exports.StandardCheckPointFrequency = StandardCheckPointFrequency = __decorate([
    (0, inversify_1.injectable)()
], StandardCheckPointFrequency);
