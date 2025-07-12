"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatementDTOMapper = void 0;
class StatementDTOMapper {
    static toStatementDTO(statement) {
        return {
            value: statement.toString()
        };
    }
}
exports.StatementDTOMapper = StatementDTOMapper;
