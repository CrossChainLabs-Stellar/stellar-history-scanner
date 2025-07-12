"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryHttpRequestIfNeeded = retryHttpRequestIfNeeded;
const asyncSleep_1 = require("./asyncSleep");
async function retryHttpRequestIfNeeded(amount, sleepMs, httpAction, ...parameters) {
    let count = 1;
    let result = await httpAction(...parameters);
    while (count < amount && retryNeeded(result)) {
        //exponential backoff
        await (0, asyncSleep_1.asyncSleep)(Math.pow(2, count) * sleepMs);
        count++;
        result = await httpAction(...parameters);
    }
    return result;
}
function retryNeeded(result) {
    if (result.isErr()) {
        return true;
        /*if (
            result.error.code &&
            [
                'ETIMEDOUT',
                'ECONNABORTED',
                'TIMEOUT',
                'ERR_REQUEST_ABORTED',
                'ECONNRESET',
                'ENOTFOUND'
            ].includes(result.error.code)
        ) {
            return true;
        }

        const status = result.error.response?.status;
        if ((status && status >= 500 && status < 600) || status === 408) {
            return true;
        }*/
    }
    return false;
}
