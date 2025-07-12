"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Quality;
(function (Quality) {
    Quality["HIGH"] = "HIGH";
    Quality["MEDIUM_OR_LOW"] = "MEDIUM_OR_LOW";
})(Quality || (Quality = {}));
class StellarCoreConfigurationGenerator {
    network;
    constructor(network) {
        this.network = network;
    }
    quorumSetToToml(quorumSet) {
        const alreadyAddedHomeDomains = new Set();
        const tomlConfig = {
            HOME_DOMAINS: [],
            VALIDATORS: []
        };
        this.processQuorumSet(quorumSet, tomlConfig, alreadyAddedHomeDomains);
        return this.stringifyToml(tomlConfig);
    }
    stringifyToml(tomlConfig) {
        let tomlString = '';
        tomlConfig.HOME_DOMAINS.forEach((homeDomain) => {
            tomlString += `[[HOME_DOMAINS]]\nHOME_DOMAIN = "${homeDomain.HOME_DOMAIN}"\nQUALITY = "${homeDomain.QUALITY}"\n\n`;
        });
        tomlConfig.VALIDATORS.forEach((validator, index) => {
            tomlString += `[[VALIDATORS]]\n`;
            tomlString += `NAME = "${validator.NAME}"\n`;
            tomlString += `PUBLIC_KEY = "${validator.PUBLIC_KEY}"\n`;
            if (validator.ADDRESS) {
                tomlString += `ADDRESS = "${validator.ADDRESS}"\n`;
            }
            if (validator.HISTORY) {
                tomlString += `HISTORY = "${validator.HISTORY}"\n`;
            }
            if (validator.HOME_DOMAIN) {
                tomlString += `HOME_DOMAIN = "${validator.HOME_DOMAIN}"\n`;
            }
            if (validator.QUALITY) {
                tomlString += `QUALITY = "${validator.QUALITY}"\n`;
            }
            // Don't add a newline after the last validator
            if (index !== tomlConfig.VALIDATORS.length - 1) {
                tomlString += '\n';
            }
        });
        return tomlString;
    }
    nodesToToml(nodes) {
        const alreadyAddedHomeDomains = new Set();
        const tomlConfig = {
            HOME_DOMAINS: [],
            VALIDATORS: []
        };
        nodes.forEach((node) => this.processValidator(node, alreadyAddedHomeDomains, tomlConfig));
        return this.stringifyToml(tomlConfig);
    }
    processQuorumSet(quorumSet, tomlConfig, alreadyAddedHomeDomains = new Set()) {
        quorumSet.validators.forEach((validator) => this.processValidator(this.network.getNodeByPublicKey(validator), alreadyAddedHomeDomains, tomlConfig));
        quorumSet.innerQuorumSets.forEach((innerQSet) => this.processQuorumSet(innerQSet, tomlConfig, alreadyAddedHomeDomains));
    }
    processValidator(validatorNode, alreadyAddedHomeDomains, tomlConfig) {
        const validatorToml = {
            NAME: validatorNode.displayName,
            PUBLIC_KEY: validatorNode.publicKey,
            ADDRESS: validatorNode.host ?? validatorNode.key
        };
        if (validatorNode.historyUrl) {
            let historyUrlWithTrailingSlash = validatorNode.historyUrl;
            if (!historyUrlWithTrailingSlash.endsWith('/'))
                historyUrlWithTrailingSlash += '/';
            validatorToml.HISTORY = `curl -sf ${historyUrlWithTrailingSlash}{0} -o {1}`;
        }
        if (validatorNode.homeDomain) {
            let quality = Quality.MEDIUM_OR_LOW;
            if (validatorNode.organizationId) {
                const organization = this.network.getOrganizationById(validatorNode.organizationId);
                if (organization.hasReliableUptime)
                    quality = Quality.HIGH;
            }
            if (!alreadyAddedHomeDomains.has(validatorNode.homeDomain)) {
                alreadyAddedHomeDomains.add(validatorNode.homeDomain);
                tomlConfig.HOME_DOMAINS.push({
                    HOME_DOMAIN: validatorNode.homeDomain,
                    QUALITY: quality
                });
            }
            validatorToml.HOME_DOMAIN = validatorNode.homeDomain;
        }
        else {
            validatorToml.QUALITY = Quality.MEDIUM_OR_LOW;
        }
        tomlConfig.VALIDATORS.push(validatorToml);
    }
}
exports.default = StellarCoreConfigurationGenerator;
