"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const VerifyArchives_1 = require("../../use-cases/verify-archives/VerifyArchives");
const Kernel_1 = __importDefault(require("../Kernel"));
// noinspection JSIgnoredPromiseFromCall
main();
async function main() {
    const kernel = await Kernel_1.default.getInstance();
    const verifyArchives = kernel.container.get(VerifyArchives_1.VerifyArchives);
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
    let persist = false;
    if (process.argv[2] === '1') {
        persist = true;
    }
    let loop = true;
    if (process.argv[3] === '0') {
        loop = false;
    }
    await verifyArchives.execute({
        persist: persist,
        loop: loop
    });
}
