export declare function createSHA256Hmac(data: Buffer, macKey: Buffer): Buffer;
export declare function verifyHmac(mac: Buffer, macKey: Buffer, data: Buffer): boolean;
export declare function verifySignature(publicKey: Buffer, signature: Buffer, message: Buffer): boolean;
export declare function createSignature(secretKey: Buffer, message: Buffer): Buffer;
//# sourceMappingURL=crypto-helper.d.ts.map