import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../auth/interface/jwt-payload.interface';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

export const User = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): string | number | JwtPayload => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    return data && user && user[data] !== undefined ? user[data] : user;
  },
);
