import { Logger } from 'pino';
import { Node } from './node';
export declare class ScpReader {
    private logger;
    private nominateVotes;
    private nominateAccepted;
    constructor(logger: Logger);
    private isNewNominateVote;
    private registerNominateVotes;
    private isNewNominateAccepted;
    private registerNominateAccepted;
    read(node: Node, ip: string, port: number, nodeNames: Map<string, string>): void;
    private translateSCPMessage;
    private translateCommit;
    private translateExternalize;
    private translatePrepare;
    private translateNominate;
    private trimString;
}
//# sourceMappingURL=scp-reader.d.ts.map