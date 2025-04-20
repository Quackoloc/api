import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { PendingUser } from './entities/pending-user.entity';
import { PendingUsersService } from './pending-users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, PendingUser])],
  controllers: [UsersController],
  providers: [UsersService, PendingUsersService],
  exports: [UsersService, PendingUsersService],
})
export class UsersModule {}
