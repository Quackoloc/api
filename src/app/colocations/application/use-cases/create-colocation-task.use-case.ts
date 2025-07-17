import { Inject, Injectable } from '@nestjs/common';
import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../../domain/gateways/colocation-task.repository.gateway';
import { CreateColocationTaskDto } from '../dtos/create-colocation-task.dto';
import { ColocationTaskDto } from '../dtos/colocation-task.dto';
import { ColocationTask } from '../../domain/entities/colocation-task.entity';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import { logger } from '../../../../config/logger.config';
import { ColocationTaskStatus } from '../../domain/enums/colocation-task-status.enum';

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
    taskToCreate.status = ColocationTaskStatus.TODO;
    taskToCreate.description = createColocationTaskDto.description;
    taskToCreate.dueDate = createColocationTaskDto.isRecurrent
      ? null
      : createColocationTaskDto.dueDate;
    taskToCreate.priority = createColocationTaskDto.priority;
    // todo: gérer la réassignation
    taskToCreate.assignedToId = createColocationTaskDto.assignToId ?? connectedUser.id;
    taskToCreate.colocationId = colocationId;
    taskToCreate.isRecurrent = createColocationTaskDto.isRecurrent;

    const task = await this.colocationTaskRepository.save(taskToCreate);

    logger.log(
      `Colocation task with id : ${task.id} created in colocation with id : ${colocationId} by user with id : ${connectedUser.id}`,
      'CreateColocationTaskUseCase'
    );

    return ColocationTaskDto.fromEntity(task);
  }
}
