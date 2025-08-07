import { Inject, Injectable } from '@nestjs/common';
import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../../domain/gateways/colocation-task.repository.gateway';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import { logger } from '../../../../config/logger.config';

@Injectable()
export class DeleteColocationTaskUseCase {
  constructor(
    @Inject(ColocationTaskRepositoryToken)
    private readonly colocationTaskRepository: ColocationTaskRepositoryGateway
  ) {}

  async execute(taskId: number, connectedUser: ConnectedUser) {
    await this.colocationTaskRepository.deleteOneById(taskId);

    logger.log(
      `Task with id : ${taskId} has been deleted by user with id : ${connectedUser.id}`,
      'DeleteColocationTaskUseCase'
    );
  }
}
