import { Inject, Injectable } from '@nestjs/common';
import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../../domain/gateways/colocation-task.repository.gateway';
import { UpdateColocationTaskDto } from '../dtos/update-colocation-task.dto';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import { logger } from '../../../../config/logger.config';

@Injectable()
export class UpdateColocationTaskUseCase {
  constructor(
    @Inject(ColocationTaskRepositoryToken)
    private readonly colocationTaskRepository: ColocationTaskRepositoryGateway
  ) {}

  async execute(
    colocationId: number,
    taskId: number,
    updateColocationTaskDto: UpdateColocationTaskDto,
    connectedUser: ConnectedUser
  ): Promise<void> {
    const taskToUpdate = await this.colocationTaskRepository.getOneById(taskId);

    await this.colocationTaskRepository.save({
      ...taskToUpdate,
      title: updateColocationTaskDto.title,
      description: updateColocationTaskDto.description,
      dueDate: updateColocationTaskDto.dueDate,
      priority: updateColocationTaskDto.priority,
      assignedToId: updateColocationTaskDto.assignToId ?? connectedUser.id,
    });

    logger.log(
      `Colocation task with id : ${taskToUpdate.id} in colocation with id : ${colocationId} updated by user with id : ${connectedUser.id}`,
      'UpdateColocationTaskUseCase'
    );
  }
}
