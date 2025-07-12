"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nullable = void 0;
//fix for JSONSchemaType not correctly inferring nullable types, could be fixed in v9
const nullable = (input) => {
    return {
        ...input,
        nullable: true
    };
};
exports.nullable = nullable;
