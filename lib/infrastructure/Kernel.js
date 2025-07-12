"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const Config_1 = require("./config/Config");
const container_1 = require("./di/container");
class Kernel {
    static instance;
    _container;
    config;
    static async getInstance(config) {
        if (!Kernel.instance) {
            if (!config) {
                const configResult = (0, Config_1.getConfigFromEnv)();
                if (configResult.isErr()) {
                    throw configResult.error;
                }
                config = configResult.value;
            }
            Kernel.instance = new Kernel();
            Kernel.instance.config = config;
            await Kernel.instance.initializeContainer(config);
        }
        return Kernel.instance;
    }
    async close() {
        Kernel.instance = undefined;
    }
    async initializeContainer(config) {
        this._container = new inversify_1.Container();
        let isTest = false;
        if (config.nodeEnv === 'test')
            isTest = true;
        (0, container_1.load)(this.container, config);
    }
    get container() {
        if (this._container === undefined)
            throw new Error('Kernel not initialized');
        return this._container;
    }
    async shutdown() { }
}
exports.default = Kernel;
