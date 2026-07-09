import { RoleType } from '../enums/role.enum';
interface FindOrCreatePhoneUserParams {
    companyId: string;
    phone: string;
    firstName?: string;
    lastName?: string;
    roleType: RoleType;
}
export declare function findOrCreatePhoneUser(prisma: any, { companyId, phone, firstName, lastName, roleType }: FindOrCreatePhoneUserParams): Promise<any>;
export {};
