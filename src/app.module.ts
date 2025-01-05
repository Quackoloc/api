import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { localConf } from './config/database.config';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionHandler } from '@nestjs/core/errors/exception-handler';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: localConf,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [{ provide: APP_FILTER, useClass: ExceptionHandler }],
})
export class AppModule {}
