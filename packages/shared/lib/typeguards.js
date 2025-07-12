"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isString = isString;
exports.isArray = isArray;
exports.isObject = isObject;
exports.isNumber = isNumber;
exports.instanceOfError = instanceOfError;
function isString(param) {
    return typeof param === 'string';
}
function isArray(array) {
    return Array.isArray(array);
}
function isObject(obj) {
    return typeof obj === 'object';
}
function isNumber(number) {
    return typeof number === 'number';
}
function instanceOfError(object) {
    return isObject(object) && 'name' in object && 'message' in object;
}
