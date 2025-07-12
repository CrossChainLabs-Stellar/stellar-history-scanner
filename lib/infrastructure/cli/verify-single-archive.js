"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const VerifySingleArchive_1 = require("../../use-cases/verify-single-archive/VerifySingleArchive");
const Kernel_1 = __importDefault(require("../Kernel"));
// noinspection JSIgnoredPromiseFromCall
main();
async function main() {
    const kernel = await Kernel_1.default.getInstance();
    const verifySingleArchive = kernel.container.get(VerifySingleArchive_1.VerifySingleArchive);
    //handle shutdown
    process
        .on('SIGTERM', async () => {
        await kernel.shutdown();
        process.exit(0);
    })
        .on('SIGINT', async () => {
        await kernel.shutdown();
        process.exit(0);
    });
    const historyUrl = process.argv[2];
    let fromLedger = undefined;
    if (!isNaN(Number(process.argv[3]))) {
        fromLedger = Number(process.argv[3]);
    }
    let toLedger = undefined;
    if (!isNaN(Number(process.argv[4]))) {
        toLedger = Number(process.argv[4]);
    }
    let concurrency = undefined;
    if (!isNaN(Number(process.argv[5]))) {
        concurrency = Number(process.argv[5]);
    }
    const result = await verifySingleArchive.execute({
        toLedger: toLedger,
        fromLedger: fromLedger,
        maxConcurrency: concurrency,
        historyUrl: historyUrl
    });
    if (result.isErr()) {
        console.log(result.error);
    }
}
