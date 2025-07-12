"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlBuilder = void 0;
const http_helper_1 = require("http-helper");
class UrlBuilder {
    static getBucketUrl(baseUrl, hash) {
        const prefix = UrlBuilder.getHexPrefix(hash);
        const urlOrError = http_helper_1.Url.create(`${baseUrl.value}/bucket${prefix}/bucket-${hash}.xdr.gz`);
        if (urlOrError.isErr())
            throw urlOrError.error;
        return urlOrError.value;
    }
    static getRootHASUrl(historyBaseUrl) {
        const urlResult = http_helper_1.Url.create(`${historyBaseUrl.value}/.well-known/stellar-history.json`);
        if (urlResult.isErr())
            throw urlResult.error;
        return urlResult.value;
    }
    static getCategoryUrl(historyBaseUrl, checkPoint, category) {
        const paddedHex = UrlBuilder.getPaddedHex(checkPoint);
        const pathPrefix = UrlBuilder.getHexPrefix(paddedHex);
        const hex = UrlBuilder.getPaddedHex(checkPoint);
        const extension = UrlBuilder.getExtension(category);
        const urlResult = http_helper_1.Url.create(`${historyBaseUrl.value}/${category}${pathPrefix}/${category}-${hex}${extension}`);
        if (urlResult.isErr())
            throw urlResult.error;
        return urlResult.value;
    }
    static getHASUrl(historyBaseUrl) {
        const urlOrError = http_helper_1.Url.create(historyBaseUrl + '/.well-known/stellar-history.json');
        if (urlOrError.isErr())
            throw urlOrError.error; // should not happen
        return urlOrError.value;
    }
    static getHexPrefix(paddedHex) {
        return `/${paddedHex.substr(0, 2)}/${paddedHex.substr(2, 2)}/${paddedHex.substr(4, 2)}`;
    }
    static getPaddedHex(ledger) {
        return ledger.toString(16).padStart(8, '0');
    }
    static getExtension(category) {
        if (['results', 'transactions', 'ledger'].includes(category))
            return '.xdr.gz';
        return '.json';
    }
}
exports.UrlBuilder = UrlBuilder;
