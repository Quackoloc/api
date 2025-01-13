import { Module } from '@nestjs/common';
import { UserService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersServiceGateway } from './gateways/users.service.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    {
      provide: UsersServiceGateway,
      useClass: UserService,
    },
  ],
  exports: [UsersServiceGateway],
})
export class UsersModule {}
