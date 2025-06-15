import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../../domain/gateways/colocation-task.repository.gateway';
import { Inject, Injectable } from '@nestjs/common';
import { logger } from '../../../../common/logger';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import { ColocationTaskStatus } from '../../domain/enums/colocation-task-status.enum';

@Injectable()
export class ChangeColocationTaskStatusUseCase {
  constructor(
    @Inject(ColocationTaskRepositoryToken)
    private readonly colocationTaskRepository: ColocationTaskRepositoryGateway
  ) {}

  async execute(
    colocationId: number,
    taskId: number,
    status: ColocationTaskStatus,
    connectedUser: ConnectedUser
  ): Promise<void> {
    const colocationTask = await this.colocationTaskRepository.getOneById(taskId);
    colocationTask.status = status;
    await this.colocationTaskRepository.save(colocationTask);

    logger.info(
      `Colocation task with id : ${taskId} in colocation with id : ${colocationId} marked as ${status} by user with id : ${connectedUser.id}`
    );
  }
}
