export declare enum RoleType {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    ACCOUNTANT = "ACCOUNTANT",
    TENANT = "TENANT",
    OWNER = "OWNER"
}
export declare const ROLE_HIERARCHY: Record<RoleType, number>;
export interface JwtPayload {
    sub: string;
    email: string;
    companyId: string;
    roles: RoleType[];
    iat?: number;
    exp?: number;
}
export interface RequestWithUser {
    user: JwtPayload;
}
export interface RequestWithCompany extends RequestWithUser {
    companyId: string;
}
