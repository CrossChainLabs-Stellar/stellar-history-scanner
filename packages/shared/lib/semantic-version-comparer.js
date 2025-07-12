"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticVersionComparer = void 0;
class SemanticVersionComparer {
    static isBehind(sourceVersion, targetVersion) {
        const regex = /v?(\d+\.\d+\.\d+)/;
        const sourceMatch = sourceVersion.match(regex);
        const parsedSourceVersion = sourceMatch ? sourceMatch[1] : null;
        if (parsedSourceVersion === null) {
            return false; // we don't know what version it is, so we can't tell if it's behind
        }
        const targetMatch = targetVersion.match(regex);
        const parsedTargetVersion = targetMatch ? targetMatch[1] : null;
        if (parsedTargetVersion === null) {
            return false; // we don't know what the target version is, so we can't tell if it's behind
        }
        const parsedSourceVersionParts = parsedSourceVersion.split(".");
        const parsedTargetVersionParts = parsedTargetVersion.split(".");
        for (let i = 0; i < parsedSourceVersionParts.length; i++) {
            const semVerPart = parseInt(parsedSourceVersionParts[i]);
            const latestSemVerPart = parseInt(parsedTargetVersionParts[i]);
            if (semVerPart < latestSemVerPart) {
                return true;
            }
            if (semVerPart > latestSemVerPart) {
                return false;
            }
        }
        return false;
    }
}
exports.SemanticVersionComparer = SemanticVersionComparer;
