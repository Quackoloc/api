import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { AccessTokenDto } from './dtos/access-token.dto';
import { TokensDto } from './dtos/tokens.dto';
import { UserDto } from '../user/application/dtos/user.dto';
import { UsersService } from '../user/users.service';
import {
  UserEmailNotFoundException,
  UserIdNotFoundException,
} from '../user/domain/user-exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userServiceGateway: UsersService
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.userServiceGateway.findOneByEmail(email);

    if (!user) {
      throw new UserEmailNotFoundException(email);
    }

    return compareSync(password, user?.password) ? UserDto.fromEntity(user) : null;
  }

  async login(email: string): Promise<TokensDto> {
    const userEntity = await this.userServiceGateway.findOneByEmail(email);

    const { id } = UserDto.fromEntity(userEntity);

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

  async refresh(refreshToken: string): Promise<AccessTokenDto> {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('JWT_SECRET'),
    });

    const user = await this.userServiceGateway.findOneById(payload.sub);

    if (!user) {
      throw new UserIdNotFoundException(payload.sub);
    }

    const accessToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES') }
    );

    return { accessToken };
  }
}
