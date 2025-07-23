import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '@app/my-lib/auth-lib/interfaces/jwt-payload';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

export const User = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): JwtPayload[keyof JwtPayload] | JwtPayload => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    return data && user && user[data] !== undefined ? user[data] : user;
  },
);

// export const User = createParamDecorator(
//   (data: keyof UserEntity | undefined, ctx: ExecutionContext): UserEntity | UserEntity[keyof UserEntity] => {
//     const request = ctx.switchToHttp().getRequest<RequestWithUser>();
//     const user = request.user;
//
//     return data && user && user[data] !== undefined ? user[data] : user;
//   },
// )
