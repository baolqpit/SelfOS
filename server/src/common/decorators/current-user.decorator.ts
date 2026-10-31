import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface JwtPayload {
  sub: string;        // user id
  username: string;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (field: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user: JwtPayload | undefined = req.user;
    if (!user) return undefined;
    return field ? user[field] : user;
  },
);
