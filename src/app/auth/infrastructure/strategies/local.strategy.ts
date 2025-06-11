import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { UserDto } from '../../../user/application/dtos/user.dto';
import { ValidateUserUseCase } from '../../application/use-cases/validate-user.use-case';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly validateUserUseCase: ValidateUserUseCase) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserDto> {
    return await this.validateUserUseCase.execute(email, password);
  }
}
