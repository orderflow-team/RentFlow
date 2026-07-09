import { RoleType } from '../../common/enums/role.enum';
export declare class CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    roles: RoleType[];
}
