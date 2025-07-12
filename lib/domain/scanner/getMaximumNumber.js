"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaximumNumber = void 0;
const getMaximumNumber = (arrayOfNumbers) => {
    return arrayOfNumbers.reduce((max, currentNumber) => (max >= currentNumber ? max : currentNumber), -Infinity);
};
exports.getMaximumNumber = getMaximumNumber;
