import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleType, ROLE_HIERARCHY } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('No user context found');
    }

    const userRoles: RoleType[] = user.roles || [];
    const maxUserLevel = Math.max(
      ...userRoles.map((r) => ROLE_HIERARCHY[r] || 0),
    );

    const minRequiredLevel = Math.min(
      ...requiredRoles.map((r) => ROLE_HIERARCHY[r] || 0),
    );

    if (maxUserLevel < minRequiredLevel) {
      throw new ForbiddenException('Insufficient role permissions');
    }

    return true;
  }
}
