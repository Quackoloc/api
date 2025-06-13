import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedUser } from '../types/connected-user.type';
import { InvalidTokenException } from '../../app/auth/domain/auth-exceptions';

export const GetConnectedUser = createParamDecorator(
  (data, ctx: ExecutionContext): ConnectedUser => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.cookies?.accessToken;
    const jwtService = new JwtService();
    const decoded = jwtService.decode(token);

    if (!decoded) {
      throw new InvalidTokenException();
    }

    return {
      id: decoded.sub,
      // permissions: decoded.permissions,
    };
  }
);
