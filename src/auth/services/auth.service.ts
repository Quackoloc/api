import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { AccessTokenDto } from '../dtos/access-token.dto';
import { TokensDto } from '../dtos/tokens.dto';
import { AuthServiceGateway } from '../gateways/auth.service.gateway';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UserDto } from '../../users/dto/user.dto';
import { UsersServiceGateway } from '../../users/gateways/users.service.gateway';
import { UserNotFoundException } from '../../users/exceptions/users-exception';

@Injectable()
export class AuthService implements AuthServiceGateway {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userServiceGateway: UsersServiceGateway,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.userServiceGateway.findOneByEmail(email);

    if (!user) {
      throw UserNotFoundException.emailNotFound(email);
    }

    return compareSync(password, user?.password)
      ? UserDto.fromEntity(user)
      : null;
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

  async register(createUserDto: CreateUserDto): Promise<UserDto> {
    return await this.userServiceGateway.create(createUserDto);
  }

  async refresh(refreshToken: string): Promise<AccessTokenDto> {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('JWT_SECRET'),
    });

    const user = await this.userServiceGateway.findOneById(payload.sub);

    if (!user) {
      throw UserNotFoundException.idNotFound(payload.sub);
    }

    const accessToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES') },
    );

    return { accessToken };
  }
}
