"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortDescending = void 0;
function sortDescending(myArray) {
    return [...myArray].sort((a, b) => b - a);
}
exports.sortDescending = sortDescending;
