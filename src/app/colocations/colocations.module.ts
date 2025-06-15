import { Module } from '@nestjs/common';
import { ColocationsController } from './presentation/controllers/colocations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Colocation } from './domain/entities/colocation.entity';
import { UserModule } from '../user/user.module';
import { ColocationRepositoryToken } from './domain/gateways/colocation.repository.gateway';
import { DataSource } from 'typeorm';
import { ColocationRepository } from './infrastructure/repositories/colocation.repository';
import { CreateColocationUseCase } from './application/use-cases/create-colocation.use-case';
import { GetColocationsUseCase } from './application/use-cases/get-colocations.use-case';
import { InvitationCode } from './domain/entities/invitation-code.entity';
import { ColocationCodeService } from './infrastructure/services/colocation-code.service';
import { ColocationCodeServiceGateway } from './domain/gateways/colocation-code.service.gateway';
import {
  InvitationCodeRepository,
  InvitationCodeRepositoryToken,
} from './infrastructure/repositories/invitation-code.repository';
import { IsColocationMemberUseCase } from './application/use-cases/is-colocation-member.use-case';
import { CreateInvitationCodeUseCase } from './application/use-cases/create-invitation-code.use-case';
import { JoinColocationUseCase } from './application/use-cases/join-colocation.use-case';
import { UpdateColocationUseCase } from './application/use-cases/update-colocation.use-case';
import { ColocationTaskRepositoryToken } from './domain/gateways/colocation-task.repository.gateway';
import { ColocationTaskRepository } from './infrastructure/repositories/colocation-task.repository';
import { ColocationTask } from './domain/entities/colocation-task.entity';
import { ColocationTaskController } from './presentation/controllers/colocation-task.controller';
import { GetColocationTasksUseCase } from './application/use-cases/get-colocation-tasks.use-case';
import { CreateColocationTaskUseCase } from './application/use-cases/create-colocation-task.use-case';
import { UpdateColocationTaskUseCase } from './application/use-cases/update-colocation-task.use-case';
import { MarkColocationTaskAsDoneUseCase } from './application/use-cases/mark-colocation-task-as-done.use-case';
import { MarkColocationTaskAsUndoneUseCase } from './application/use-cases/mark-colocation-task-as-undone.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Colocation]), UserModule, InvitationCode],
  providers: [
    CreateColocationUseCase,
    GetColocationsUseCase,
    IsColocationMemberUseCase,
    CreateInvitationCodeUseCase,
    JoinColocationUseCase,
    UpdateColocationUseCase,
    GetColocationTasksUseCase,
    CreateColocationTaskUseCase,
    UpdateColocationTaskUseCase,
    MarkColocationTaskAsDoneUseCase,
    MarkColocationTaskAsUndoneUseCase,
    {
      provide: ColocationRepositoryToken,
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => {
        const baseRepo = dataSource.getRepository(Colocation);
        return new ColocationRepository(baseRepo.target, baseRepo.manager, baseRepo.queryRunner);
      },
    },
    {
      provide: InvitationCodeRepositoryToken,
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => {
        const baseRepo = dataSource.getRepository(InvitationCode);
        return new InvitationCodeRepository(
          baseRepo.target,
          baseRepo.manager,
          baseRepo.queryRunner
        );
      },
    },
    {
      provide: ColocationTaskRepositoryToken,
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => {
        const baseRepo = dataSource.getRepository(ColocationTask);
        return new ColocationTaskRepository(
          baseRepo.target,
          baseRepo.manager,
          baseRepo.queryRunner
        );
      },
    },
    {
      provide: ColocationCodeServiceGateway,
      useClass: ColocationCodeService,
    },
  ],
  controllers: [ColocationsController, ColocationTaskController],
})
export class ColocationsModule {}
