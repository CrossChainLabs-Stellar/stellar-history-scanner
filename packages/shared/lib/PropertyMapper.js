"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PropertyMapper {
    static mapProperties(dto, domainObject, propertiesToSkip) {
        for (const [key] of Object.entries(dto)) {
            if (!propertiesToSkip.includes(key)) {
                PropertyMapper.mapProperty(key, dto, domainObject);
            }
        }
    }
    static mapProperty(property, dto, domainObject) {
        if (dto[property] === undefined)
            return;
        domainObject[property] = dto[property];
    }
}
exports.default = PropertyMapper;
