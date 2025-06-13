import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { localConf } from '../config/database.config';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionHandler } from '@nestjs/core/errors/exception-handler';
import { ColocationsModule } from './colocations/colocations.module';
import { TasksModule } from './tasks/tasks.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: localConf,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ColocationsModule,
    TasksModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionHandler,
    },
  ],
  exports: [],
  controllers: [AppController],
})
export class AppModule {}
