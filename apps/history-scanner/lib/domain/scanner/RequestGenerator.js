"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestGenerator = void 0;
const UrlBuilder_1 = require("../history-archive/UrlBuilder");
const Category_1 = require("../history-archive/Category");
class RequestGenerator {
    static *generateBucketRequests(bucketHashes, baseUrl, requestMethod) {
        for (const hash of bucketHashes) {
            yield {
                url: UrlBuilder_1.UrlBuilder.getBucketUrl(baseUrl, hash),
                meta: {
                    hash: hash
                },
                method: requestMethod
            };
        }
    }
    static *generateCategoryRequests(checkPointGenerator, historyArchiveBaseUrl, requestMethod, categories = [Category_1.Category.ledger, Category_1.Category.results, Category_1.Category.transactions]) {
        for (const checkPoint of checkPointGenerator) {
            for (const category of categories) {
                yield {
                    url: UrlBuilder_1.UrlBuilder.getCategoryUrl(historyArchiveBaseUrl, checkPoint, category),
                    meta: {
                        category: category
                    },
                    method: requestMethod
                };
            }
        }
    }
    static *generateHASRequests(historyArchiveBaseUrl, checkPointGenerator, requestMethod) {
        for (const checkPoint of checkPointGenerator) {
            yield {
                url: UrlBuilder_1.UrlBuilder.getCategoryUrl(historyArchiveBaseUrl, checkPoint, Category_1.Category.history),
                meta: {
                    checkPoint: checkPoint
                },
                method: requestMethod
            };
        }
    }
}
exports.RequestGenerator = RequestGenerator;
