"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePhone = normalizePhone;
const common_1 = require("@nestjs/common");
function normalizePhone(raw) {
    if (!raw) {
        throw new common_1.BadRequestException('Phone number is required');
    }
    const hasLeadingPlus = raw.trim().startsWith('+');
    const digits = raw.replace(/[^0-9]/g, '');
    if (!digits) {
        throw new common_1.BadRequestException('Phone number is invalid');
    }
    return (hasLeadingPlus ? '+' : '') + digits;
}
//# sourceMappingURL=phone.util.js.map