import { Network } from './network';
import { Node } from './node';
import { QuorumSet } from './quorum-set';
declare enum Quality {
    HIGH = "HIGH",
    MEDIUM_OR_LOW = "MEDIUM_OR_LOW"
}
interface HomeDomain {
    HOME_DOMAIN: string;
    QUALITY: Quality;
}
interface Validator {
    NAME: string;
    QUALITY?: string;
    HOME_DOMAIN?: string;
    PUBLIC_KEY: string;
    ADDRESS?: string;
    HISTORY?: string;
}
interface TomlConfig {
    HOME_DOMAINS: HomeDomain[];
    VALIDATORS: Validator[];
}
export default class StellarCoreConfigurationGenerator {
    protected network: Network;
    constructor(network: Network);
    quorumSetToToml(quorumSet: QuorumSet): string;
    private stringifyToml;
    nodesToToml(nodes: Node[]): string;
    protected processQuorumSet(quorumSet: QuorumSet, tomlConfig: TomlConfig, alreadyAddedHomeDomains?: Set<string>): void;
    protected processValidator(validatorNode: Node, alreadyAddedHomeDomains: Set<string>, tomlConfig: TomlConfig): void;
}
export {};
//# sourceMappingURL=stellar-core-configuration-generator.d.ts.map