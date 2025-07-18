"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLowestNumber = getLowestNumber;
//works for large arrays
function getLowestNumber(numbers) {
    let lowest = Number.MAX_SAFE_INTEGER;
    for (const nr of numbers) {
        if (nr < lowest)
            lowest = nr;
    }
    return lowest;
}
