import { xdr } from '@stellar/stellar-base';
import AuthenticatedMessage = xdr.AuthenticatedMessage;
import { Result } from 'neverthrow';
import StellarMessage = xdr.StellarMessage;
declare const _default: {
    getMessageLengthFromXDRBuffer: (buffer: Buffer) => number;
    xdrBufferContainsCompleteMessage: (buffer: Buffer, messageLength: number) => boolean;
    getMessageFromXdrBuffer: (buffer: Buffer, messageLength: number) => [Buffer, Buffer];
    getXdrBufferFromMessage: (message: AuthenticatedMessage | StellarMessage) => Result<Buffer, Error>;
};
export default _default;
//# sourceMappingURL=xdr-buffer-converter.d.ts.map