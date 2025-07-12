"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockHistoryArchive = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class MockHistoryArchive {
    server;
    api = (0, express_1.default)();
    async listen(port = 3000) {
        return new Promise((resolve, reject) => {
            this.api.get('*.json', async (req, res) => {
                const file = path_1.default.join(__dirname, '/__fixtures__/', path_1.default.basename(req.path));
                const content = fs_1.default.readFileSync(file, { encoding: 'utf8' });
                res.send(content);
            });
            this.api.get('*.xdr.gz', async (req, res) => {
                const file = path_1.default.join(__dirname, '/__fixtures__/', path_1.default.basename(req.path));
                fs_1.default.createReadStream(file).pipe(res);
            });
            this.api.head('*', async (req, res) => {
                res.status(200).send('go');
            });
            this.server = this.api.listen(port, () => resolve());
        });
    }
    async stop() {
        return new Promise((resolve, reject) => {
            if (!this.server)
                return;
            this.server.close(async () => {
                resolve();
            });
        });
    }
}
exports.MockHistoryArchive = MockHistoryArchive;
