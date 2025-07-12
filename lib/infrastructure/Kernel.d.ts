import 'reflect-metadata';
import { Container } from 'inversify';
import { Config } from './config/Config';
export default class Kernel {
    private static instance?;
    protected _container?: Container;
    config: Config;
    static getInstance(config?: Config): Promise<Kernel>;
    close(): Promise<void>;
    private initializeContainer;
    get container(): Container;
    shutdown(): Promise<void>;
}
//# sourceMappingURL=Kernel.d.ts.map