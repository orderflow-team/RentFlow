export enum RoleType {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  ACCOUNTANT = 'ACCOUNTANT',
  TENANT = 'TENANT',
  OWNER = 'OWNER',
}

export const ROLE_HIERARCHY: Record<RoleType, number> = {
  [RoleType.ADMIN]: 100,
  [RoleType.MANAGER]: 80,
  [RoleType.ACCOUNTANT]: 60,
  [RoleType.OWNER]: 40,
  [RoleType.TENANT]: 20,
};

export interface JwtPayload {
  sub: string;       // user id
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
