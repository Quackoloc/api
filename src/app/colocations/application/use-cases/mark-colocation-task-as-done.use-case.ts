import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../../domain/gateways/colocation-task.repository.gateway';
import { Inject, Injectable } from '@nestjs/common';
import { logger } from '../../../../common/logger';
import { ConnectedUser } from '../../../../common/types/connected-user.type';

@Injectable()
export class MarkColocationTaskAsDoneUseCase {
  constructor(
    @Inject(ColocationTaskRepositoryToken)
    private readonly colocationTaskRepository: ColocationTaskRepositoryGateway
  ) {}

  async execute(colocationId: number, taskId: number, connectedUser: ConnectedUser): Promise<void> {
    const colocationTask = await this.colocationTaskRepository.getOneById(taskId);
    colocationTask.completed = true;
    await this.colocationTaskRepository.save(colocationTask);

    logger.info(
      `Colocation task with id : ${taskId} in colocation with id : ${colocationId} marked as done by user with id : ${connectedUser.id}`
    );
  }
}
