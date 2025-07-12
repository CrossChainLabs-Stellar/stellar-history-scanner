"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortDescending = sortDescending;
function sortDescending(myArray) {
    return [...myArray].sort((a, b) => b - a);
}
