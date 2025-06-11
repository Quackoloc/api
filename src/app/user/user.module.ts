import { Module } from '@nestjs/common';
import { User } from './domain/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { PendingUser } from './domain/entities/pending-user.entity';
import { PendingUsersService } from './pending-users.service';
import { UserController } from './presentation/controllers/user.controller';
import { UserRepositoryToken } from './domain/gateways/user.repository.gateway';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, PendingUser])],
  controllers: [UserController],
  providers: [
    UsersService,
    PendingUsersService,
    CreateUserUseCase,
    {
      provide: UserRepositoryToken,
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => {
        const baseRepo = dataSource.getRepository(User);
        return new UserRepository(baseRepo.target, baseRepo.manager, baseRepo.queryRunner);
      },
    },
  ],
  exports: [UsersService, CreateUserUseCase, PendingUsersService, UserRepositoryToken],
})
export class UserModule {}
