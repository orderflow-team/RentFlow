import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '../enums/role.enum';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): JwtPayload[keyof JwtPayload] | JwtPayload | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const user: JwtPayload = request.user;
    return data ? user?.[data] : user;
  },
);
