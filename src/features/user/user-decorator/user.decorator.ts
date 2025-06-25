import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/features/auth/interface/jwt-payload.interface';

export const User = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): string | JwtPayload => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload;

    return data ? user?.[data] : user;
  },
);
