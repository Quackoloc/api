import { Module } from '@nestjs/common';
import { User } from './domain/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingUser } from './domain/entities/pending-user.entity';
import { UserController } from './presentation/controllers/user.controller';
import { UserRepositoryToken } from './domain/gateways/user.repository.gateway';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { DataSource } from 'typeorm';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([User, PendingUser])],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    {
      provide: UserRepositoryToken,
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => {
        const baseRepo = dataSource.getRepository(User);
        return new UserRepository(baseRepo.target, baseRepo.manager, baseRepo.queryRunner);
      },
    },
  ],
  exports: [CreateUserUseCase, UserRepositoryToken],
})
export class UserModule {}
