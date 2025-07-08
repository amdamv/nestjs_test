import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../../auth/interface/jwt-payload.interface';

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): JwtPayload => {
  const request = context.switchToHttp().getRequest<Request>();
  return request.user as JwtPayload;
});
