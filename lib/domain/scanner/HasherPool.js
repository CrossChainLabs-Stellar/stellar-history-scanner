"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasherPool = void 0;
const workerpool = __importStar(require("workerpool"));
const os = __importStar(require("os"));
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class HasherPool {
    workerpool;
    terminated = false;
    constructor() {
        try {
            require(__dirname + '/hash-worker.import.js');
            this.workerpool = workerpool.pool(__dirname + '/hash-worker.import.js', {
                minWorkers: Math.max((os.cpus().length || 4) - 1, 1)
            });
        }
        catch (e) {
            this.workerpool = workerpool.pool(__dirname + '/hash-worker.js', {
                minWorkers: Math.max((os.cpus().length || 4) - 1, 1)
            });
        }
    }
}
exports.HasherPool = HasherPool;
