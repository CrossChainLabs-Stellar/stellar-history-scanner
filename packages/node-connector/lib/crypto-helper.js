"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSHA256Hmac = createSHA256Hmac;
exports.verifyHmac = verifyHmac;
exports.verifySignature = verifySignature;
exports.createSignature = createSignature;
const crypto = __importStar(require("crypto"));
const sodium_native_1 = require("sodium-native");
function createSHA256Hmac(data, macKey) {
    return crypto.createHmac('SHA256', macKey).update(data).digest();
}
function verifyHmac(mac, macKey, data) {
    const calculatedMac = crypto
        .createHmac('SHA256', macKey)
        .update(data)
        .digest();
    return crypto.timingSafeEqual(calculatedMac, mac);
}
function verifySignature(publicKey, signature, message) {
    return (0, sodium_native_1.crypto_sign_verify_detached)(signature, message, publicKey);
}
function createSignature(secretKey, message) {
    const signature = Buffer.alloc(sodium_native_1.crypto_sign_BYTES);
    (0, sodium_native_1.crypto_sign_detached)(signature, message, secretKey);
    return signature;
}
