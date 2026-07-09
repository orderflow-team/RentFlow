export declare const RoleType: {
    readonly ADMIN: "ADMIN";
    readonly MANAGER: "MANAGER";
    readonly ACCOUNTANT: "ACCOUNTANT";
    readonly TENANT: "TENANT";
    readonly OWNER: "OWNER";
};
export type RoleType = (typeof RoleType)[keyof typeof RoleType];
export declare const UserStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
    readonly INVITED: "INVITED";
    readonly SUSPENDED: "SUSPENDED";
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export declare const CompanyStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly TRIAL: "TRIAL";
    readonly SUSPENDED: "SUSPENDED";
    readonly CANCELLED: "CANCELLED";
};
export type CompanyStatus = (typeof CompanyStatus)[keyof typeof CompanyStatus];
