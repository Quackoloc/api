import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedUser } from '../../modules/auth/connected-user.model';

export const GetConnectedUser = createParamDecorator(
  (data, ctx: ExecutionContext): ConnectedUser => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const token = authHeader.split(' ')[1];
    const jwtService = new JwtService();
    const decoded = jwtService.decode(token);

    if (!decoded) {
      //todo: user app exception
      throw new Error('No token found');
    }

    return {
      id: decoded.sub,
      permissions: decoded.permissions,
    };
  }
);
