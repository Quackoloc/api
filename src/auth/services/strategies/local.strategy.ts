import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { AuthServiceGateway } from '../../gateways/auth.service.gateway';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authServiceGateway: AuthServiceGateway) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    return await this.authServiceGateway.validateUser(email, password);
  }
}
