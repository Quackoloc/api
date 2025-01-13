import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './services/strategies/jwt.strategy';
import { LocalStrategy } from './services/strategies/local.strategy';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthServiceGateway } from './gateways/auth.service.gateway';

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
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthServiceGateway,
      useClass: AuthService,
    },
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthServiceGateway],
})
export class AuthModule {}
