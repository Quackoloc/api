import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColocationTask } from './domain/entities/colocation-task.entity';
import { GetColocationTasksUseCase } from './application/use-cases/get-colocation-tasks.use-case';
import { CreateColocationTaskUseCase } from './application/use-cases/create-colocation-task.use-case';
import { UpdateColocationTaskUseCase } from './application/use-cases/update-colocation-task.use-case';
import { ChangeColocationTaskStatusUseCase } from './application/use-cases/change-colocation-task-status.use-case';
import { DeleteColocationTaskUseCase } from './application/use-cases/delete-colocation-task.use-case';
import { TaskRotationScheduler } from '../schedulers/task-rotation.scheduler';
import { ColocationTaskRepositoryToken } from './domain/gateways/colocation-task.repository.gateway';
import { DataSource } from 'typeorm';
import { ColocationTaskRepository } from './infrastructure/repositories/colocation-task.repository';
import { ColocationTaskController } from './presentation/controllers/colocation-task.controller';
import { ColocationsModule } from '../colocations/colocations.module';
import { UserTaskPreference } from './domain/entities/user-task-preference.entity';
import { UserTaskPreferenceRepository } from './infrastructure/repositories/user-task-preference.repository';
import { UserTaskPreferenceRepositoryToken } from './domain/gateways/user-task-preference.repository.gateway';
import { ChangeUserTaskPreferenceUseCase } from './application/use-cases/change-user-task-preference.use-case';
import { UserTaskPreferenceController } from './presentation/controllers/user-task-preference.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ColocationTask, UserTaskPreference]), ColocationsModule],
  providers: [
    GetColocationTasksUseCase,
    CreateColocationTaskUseCase,
    UpdateColocationTaskUseCase,
    ChangeColocationTaskStatusUseCase,
    DeleteColocationTaskUseCase,
    ChangeUserTaskPreferenceUseCase,
    TaskRotationScheduler,
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
      provide: UserTaskPreferenceRepositoryToken,
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => {
        const baseRepo = dataSource.getRepository(UserTaskPreference);
        return new UserTaskPreferenceRepository(
          baseRepo.target,
          baseRepo.manager,
          baseRepo.queryRunner
        );
      },
    },
  ],
  controllers: [ColocationTaskController, UserTaskPreferenceController],
  exports: [ColocationTaskRepositoryToken],
})
export class TasksModule {}
