import { Inject, Injectable } from '@nestjs/common';
import {
  UserRepositoryGateway,
  UserRepositoryToken,
} from '../../../user/domain/gateways/user.repository.gateway';
import { UserDto } from '../../../user/application/dtos/user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokensDto } from '../dtos/tokens.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepositoryGateway,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async execute(email: string): Promise<TokensDto> {
    const user = await this.userRepository.getOneByEmail(email);

    const { id } = UserDto.fromEntity(user);

    const payload = { sub: id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
