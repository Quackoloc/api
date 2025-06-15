import { Inject, Injectable } from '@nestjs/common';
import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../../domain/gateways/colocation-task.repository.gateway';
import { CreateColocationTaskDto } from '../dtos/create-colocation-task.dto';
import { ColocationTaskDto } from '../dtos/colocation-task.dto';
import { ColocationTask } from '../../domain/entities/colocation-task.entity';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import { logger } from '../../../../common/logger';

@Injectable()
export class CreateColocationTaskUseCase {
  constructor(
    @Inject(ColocationTaskRepositoryToken)
    private readonly colocationTaskRepository: ColocationTaskRepositoryGateway
  ) {}

  async execute(
    colocationId: number,
    createColocationTaskDto: CreateColocationTaskDto,
    connectedUser: ConnectedUser
  ) {
    const taskToCreate = new ColocationTask();
    taskToCreate.title = createColocationTaskDto.title;
    taskToCreate.completed = false;
    taskToCreate.description = createColocationTaskDto.description;
    taskToCreate.dueDate = createColocationTaskDto.dueDate;
    taskToCreate.priority = createColocationTaskDto.priority;
    taskToCreate.assignedToId = createColocationTaskDto.assignToId ?? connectedUser.id;
    taskToCreate.colocationId = colocationId;

    const task = await this.colocationTaskRepository.save(taskToCreate);

    logger.info(
      `Colocation task with id : ${task.id} created in colocation with id : ${colocationId} by user with id : ${connectedUser.id}`
    );

    return ColocationTaskDto.fromEntity(task);
  }
}
