import { CreateLeaseDto } from './create-lease.dto';
declare const LeaseTermsDto_base: import("@nestjs/mapped-types").MappedType<Omit<CreateLeaseDto, "unitId" | "tenantId">>;
declare class LeaseTermsDto extends LeaseTermsDto_base {
}
export declare class AssignTenantByPhoneDto extends LeaseTermsDto {
    unitId: string;
    phone: string;
    firstName?: string;
    lastName?: string;
    email?: string;
}
export {};
