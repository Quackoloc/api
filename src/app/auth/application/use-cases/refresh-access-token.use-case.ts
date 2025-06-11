import { Inject, Injectable } from '@nestjs/common';
import {
  UserRepositoryGateway,
  UserRepositoryToken,
} from '../../../user/domain/gateways/user.repository.gateway';
import { AccessTokenDto } from '../dtos/access-token.dto';
import { UserIdNotFoundException } from '../../../user/domain/user-exceptions';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshAccessTokenUseCase {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepositoryGateway,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async execute(refreshToken: string): Promise<AccessTokenDto> {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('JWT_SECRET'),
    });

    const user = await this.userRepository.getById(payload.sub);

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
