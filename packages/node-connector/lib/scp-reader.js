"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScpReader = void 0;
const stellar_base_1 = require("@stellar/stellar-base");
class ScpReader {
    logger;
    nominateVotes = new Map();
    nominateAccepted = new Map();
    constructor(logger) {
        this.logger = logger;
    }
    isNewNominateVote(ledger, publicKey, value) {
        if (value.length === 0)
            return false;
        const ledgerVotes = this.nominateVotes.get(ledger);
        if (!ledgerVotes)
            return true;
        const votesByNode = ledgerVotes.get(publicKey);
        if (!votesByNode)
            return true;
        return votesByNode.length !== value.length;
    }
    registerNominateVotes(ledger, publicKey, value) {
        let ledgerVotes = this.nominateVotes.get(ledger);
        if (!ledgerVotes) {
            ledgerVotes = new Map();
            this.nominateVotes.set(ledger, ledgerVotes);
        }
        const votesByNode = ledgerVotes.get(publicKey);
        if (!votesByNode) {
            ledgerVotes.set(publicKey, value);
        }
    }
    isNewNominateAccepted(ledger, publicKey, value) {
        if (value.length === 0)
            return false;
        const ledgerAccepted = this.nominateAccepted.get(ledger);
        if (!ledgerAccepted)
            return true;
        const acceptedByNode = ledgerAccepted.get(publicKey);
        if (!acceptedByNode)
            return true;
        return acceptedByNode.length !== value.length;
    }
    registerNominateAccepted(ledger, publicKey, value) {
        let ledgerAccepted = this.nominateAccepted.get(ledger);
        if (!ledgerAccepted) {
            ledgerAccepted = new Map();
            this.nominateAccepted.set(ledger, ledgerAccepted);
        }
        const acceptedByNode = ledgerAccepted.get(publicKey);
        if (!acceptedByNode) {
            ledgerAccepted.set(publicKey, value);
        }
    }
    read(node, ip, port, nodeNames) {
        this.logger.info('Connecting to ' + ip + ':' + port);
        const connection = node.connectTo(ip, port);
        connection
            .on('connect', (publicKey, nodeInfo) => {
            console.log('Connected to Stellar Node: ' + publicKey);
            console.log(nodeInfo);
        })
            .on('data', (stellarMessageJob) => {
            const stellarMessage = stellarMessageJob.stellarMessage;
            //console.log(stellarMessage.toXDR('base64'))
            switch (stellarMessage.switch()) {
                case stellar_base_1.xdr.MessageType.scpMessage():
                    this.translateSCPMessage(stellarMessage, nodeNames);
                    break;
                default:
                    console.log('rcv StellarMessage of type ' + stellarMessage.switch().name //+
                    //': ' +
                    //	stellarMessage.toXDR('base64')
                    );
                    break;
            }
            stellarMessageJob.done();
        })
            .on('error', (err) => {
            console.log(err);
        })
            .on('close', () => {
            console.log('closed connection');
        })
            .on('timeout', () => {
            console.log('timeout');
            connection.destroy();
        });
    }
    translateSCPMessage(stellarMessage, nodeNames) {
        const publicKey = stellar_base_1.StrKey.encodeEd25519PublicKey(stellarMessage.envelope().statement().nodeId().value()).toString();
        const name = nodeNames.get(publicKey);
        const ledger = stellarMessage.envelope().statement().slotIndex().toString();
        if (stellarMessage.envelope().statement().pledges().switch() ===
            stellar_base_1.xdr.ScpStatementType.scpStNominate()) {
            this.translateNominate(stellarMessage, ledger, publicKey, name);
        }
        else if (stellarMessage.envelope().statement().pledges().switch() ===
            stellar_base_1.xdr.ScpStatementType.scpStPrepare()) {
            this.translatePrepare(stellarMessage, ledger, name);
        }
        else if (stellarMessage.envelope().statement().pledges().switch() ===
            stellar_base_1.xdr.ScpStatementType.scpStConfirm()) {
            this.translateCommit(stellarMessage, ledger, name);
        }
        else if (stellarMessage.envelope().statement().pledges().switch() ===
            stellar_base_1.xdr.ScpStatementType.scpStExternalize()) {
            this.translateExternalize(stellarMessage, ledger, name);
        }
    }
    translateCommit(stellarMessage, ledger, name) {
        const ballotValue = this.trimString(stellarMessage
            .envelope()
            .statement()
            .pledges()
            .confirm()
            .ballot()
            .value()
            .toString('hex'));
        const cCounter = stellarMessage
            .envelope()
            .statement()
            .pledges()
            .confirm()
            .nCommit();
        const hCounter = stellarMessage
            .envelope()
            .statement()
            .pledges()
            .confirm()
            .nH();
        const preparedCounter = stellarMessage
            .envelope()
            .statement()
            .pledges()
            .confirm()
            .nPrepared();
        console.log(ledger +
            ': ' +
            name +
            ':ACCEPT(COMMIT<' +
            cCounter +
            ' - ' +
            hCounter +
            ',' +
            ballotValue +
            '>)');
        console.log(ledger + ': ' + name + ':VOTE|ACCEPT(PREPARE<Inf,' + ballotValue + '>)');
        console.log(ledger +
            ': ' +
            name +
            ':ACCEPT(PREPARE<' +
            preparedCounter +
            ',' +
            ballotValue +
            '>)');
        console.log(ledger +
            ': ' +
            name +
            ':CONFIRM(PREPARE<' +
            hCounter +
            ',' +
            ballotValue +
            '>)');
        console.log(ledger +
            ': ' +
            name +
            ':VOTE(COMMIT<' +
            cCounter +
            ' - Inf,' +
            ballotValue +
            '>)');
    }
    translateExternalize(stellarMessage, ledger, name) {
        const ballotValue = this.trimString(stellarMessage
            .envelope()
            .statement()
            .pledges()
            .externalize()
            .commit()
            .value()
            .toString('hex'));
        const ballotCounter = stellarMessage
            .envelope()
            .statement()
            .pledges()
            .externalize()
            .commit()
            .counter();
        console.log(ledger +
            ': ' +
            name +
            ':ACCEPT(COMMIT<' +
            ballotCounter +
            ' - Inf,' +
            ballotValue +
            '>)');
        const hCounter = stellarMessage
            .envelope()
            .statement()
            .pledges()
            .externalize()
            .nH();
        console.log(ledger +
            ': ' +
            name +
            ':CONFIRM(COMMIT<' +
            ballotCounter +
            ' - ' +
            hCounter +
            ',' +
            ballotValue +
            '>)');
        console.log(ledger + ': ' + name + ':ACCEPT(PREPARE<Inf,' + ballotValue + '>)');
        console.log(ledger +
            ': ' +
            name +
            ':CONFIRM(PREPARE<' +
            hCounter +
            ',' +
            ballotValue +
            '>)');
    }
    translatePrepare(stellarMessage, ledger, name) {
        const ballotValue = this.trimString(stellarMessage
            .envelope()
            .statement()
            .pledges()
            .prepare()
            .ballot()
            .value()
            .toString('hex'));
        const ballotCounter = stellarMessage
            .envelope()
            .statement()
            .pledges()
            .prepare()
            .ballot()
            .counter()
            .toString();
        const prepared = stellarMessage
            .envelope()
            .statement()
            .pledges()
            .prepare()
            .prepared();
        console.log(ledger +
            ': ' +
            name +
            ':VOTE(PREPARE<' +
            ballotCounter +
            ',' +
            ballotValue +
            '>)');
        if (prepared) {
            const preparedBallotValue = this.trimString(prepared.value().toString('hex'));
            const preparedBallotCounter = prepared.counter().toString();
            console.log(ledger +
                ': ' +
                name +
                ':ACCEPT(PREPARE<' +
                preparedBallotCounter +
                ',' +
                preparedBallotValue +
                '>)');
            //if prepared.value changes, ABORT is implied for all indices smaller than aCounter. aCounter is computed (see doc).
        }
        const hCounter = stellarMessage
            .envelope()
            .statement()
            .pledges()
            .prepare()
            .nH();
        if (hCounter !== 0 && hCounter !== undefined) {
            console.log(ledger +
                ': ' +
                name +
                ':CONFIRM(PREPARE<' +
                hCounter +
                ',' +
                ballotValue +
                '>)');
        }
        const cCounter = stellarMessage
            .envelope()
            .statement()
            .pledges()
            .prepare()
            .nC();
        if (cCounter !== 0 && cCounter !== undefined) {
            console.log(ledger +
                ': ' +
                name +
                ':VOTE(COMMIT<' +
                cCounter +
                ' - ' +
                hCounter +
                ',' +
                ballotValue +
                '>)');
        }
    }
    translateNominate(stellarMessage, ledger, publicKey, name) {
        const nominateVotes = stellarMessage
            .envelope()
            .statement()
            .pledges()
            .nominate()
            .votes()
            .map((vote) => {
            return this.trimString(vote.toString('hex'));
        });
        if (this.isNewNominateVote(ledger, publicKey, nominateVotes)) {
            console.log(ledger + ': ' + name + ':VOTE(NOMINATE([' + nominateVotes + ']))');
            this.registerNominateVotes(ledger, publicKey, nominateVotes);
        }
        const nominateAccepted = stellarMessage
            .envelope()
            .statement()
            .pledges()
            .nominate()
            .accepted()
            .map((accepted) => {
            return this.trimString(accepted.toString('hex'));
        });
        if (this.isNewNominateAccepted(ledger, publicKey, nominateAccepted)) {
            console.log(ledger + ': ' + name + ':ACCEPT(NOMINATE([' + nominateAccepted + ']))');
            this.registerNominateAccepted(ledger, publicKey, nominateAccepted);
        }
    }
    trimString(str, lengthToShow = 5) {
        if (str.length <= lengthToShow * 2) {
            return str;
        }
        const start = str.substring(0, lengthToShow);
        const end = str.substring(str.length - lengthToShow);
        return `${start}...${end}`;
    }
}
exports.ScpReader = ScpReader;
