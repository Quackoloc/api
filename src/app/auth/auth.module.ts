import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { AuthController } from './presentation/controllers/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { ValidateUserUseCase } from './application/use-cases/validate-user.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshAccessTokenUseCase } from './application/use-cases/refresh-access-token.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES'),
          },
        };
      },
    }),
    UserModule,
  ],
  providers: [
    ValidateUserUseCase,
    LoginUseCase,
    RefreshAccessTokenUseCase,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
