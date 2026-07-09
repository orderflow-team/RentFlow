"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLeaseDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_lease_dto_1 = require("./create-lease.dto");
class UpdateLeaseDto extends (0, mapped_types_1.PartialType)(create_lease_dto_1.CreateLeaseDto) {
}
exports.UpdateLeaseDto = UpdateLeaseDto;
//# sourceMappingURL=update-lease.dto.js.map