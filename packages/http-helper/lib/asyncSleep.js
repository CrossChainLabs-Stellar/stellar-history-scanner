"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncSleep = asyncSleep;
async function asyncSleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
