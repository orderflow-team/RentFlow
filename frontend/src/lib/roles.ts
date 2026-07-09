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

export function roleLabel(role: string): string {
  switch (role) {
    case RoleType.ADMIN:
      return 'Admin';
    case RoleType.MANAGER:
      return 'Manager';
    case RoleType.ACCOUNTANT:
      return 'Accountant';
    case RoleType.OWNER:
      return 'Owner';
    case RoleType.TENANT:
      return 'Tenant';
    default:
      return role;
  }
}

export function hasMinRole(role: string | undefined, floor: RoleType): boolean {
  if (!role) return false;
  const level = ROLE_HIERARCHY[role as RoleType] ?? 0;
  return level >= ROLE_HIERARCHY[floor];
}

export function isStaffRole(role: string | undefined): boolean {
  return role === RoleType.ADMIN || role === RoleType.MANAGER || role === RoleType.ACCOUNTANT;
}

export function isOwnerRole(role: string | undefined): boolean {
  return role === RoleType.OWNER;
}

export function isTenantRole(role: string | undefined): boolean {
  return role === RoleType.TENANT;
}
