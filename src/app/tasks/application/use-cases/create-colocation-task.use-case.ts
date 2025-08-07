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
import {
  ColocationRepositoryGateway,
  ColocationRepositoryToken,
} from '../../../colocations/domain/gateways/colocation.repository.gateway';

@Injectable()
export class CreateColocationTaskUseCase {
  constructor(
    @Inject(ColocationTaskRepositoryToken)
    private readonly colocationTaskRepository: ColocationTaskRepositoryGateway,
    @Inject(ColocationRepositoryToken)
    private readonly colocationRepository: ColocationRepositoryGateway
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
    taskToCreate.assignedToId =
      createColocationTaskDto.assignToId ??
      (await this.getNextAssigneeId(colocationId, connectedUser.id));

    taskToCreate.colocationId = colocationId;
    taskToCreate.isRecurrent = createColocationTaskDto.isRecurrent;

    const task = await this.colocationTaskRepository.save(taskToCreate);

    logger.log(
      `Colocation task with id : ${task.id} created in colocation with id : ${colocationId} by user with id : ${connectedUser.id}`,
      'CreateColocationTaskUseCase'
    );

    return ColocationTaskDto.fromEntity(task);
  }

  private async getNextAssigneeId(colocationId: number, connectedUserId: number): Promise<number> {
    const colocation = await this.colocationRepository.getById(colocationId, { members: true });

    if (!colocation.members || colocation.members.length === 0) {
      return connectedUserId;
    }

    const tasks = await this.colocationTaskRepository.findByColocationId(colocationId, {
      assignedTo: true,
    });

    const taskCountByUser = new Map<number, number>();
    colocation.members.forEach((member) => {
      taskCountByUser.set(member.id, 0);
    });

    tasks.forEach((task) => {
      if (task.assignedToId && taskCountByUser.has(task.assignedToId)) {
        taskCountByUser.set(task.assignedToId, (taskCountByUser.get(task.assignedToId) || 0) + 1);
      }
    });

    let minTasks = Infinity;
    let selectedUserId = connectedUserId;

    for (const [userId, count] of taskCountByUser.entries()) {
      if (count < minTasks || (count === minTasks && userId === connectedUserId)) {
        minTasks = count;
        selectedUserId = userId;
      }
    }

    return selectedUserId;
  }
}
