import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../tasks/domain/gateways/colocation-task.repository.gateway';
import {
  ColocationRepositoryGateway,
  ColocationRepositoryToken,
} from '../colocations/domain/gateways/colocation.repository.gateway';
import { ColocationTaskStatus } from '../tasks/domain/enums/colocation-task-status.enum';
import { logger } from '../../config/logger.config';
import { Colocation } from '../colocations/domain/entities/colocation.entity';

@Injectable()
export class TaskRotationScheduler {
  constructor(
    @Inject(ColocationTaskRepositoryToken)
    private readonly colocationTaskRepository: ColocationTaskRepositoryGateway,
    @Inject(ColocationRepositoryToken)
    private readonly colocationRepository: ColocationRepositoryGateway
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async rotateTasks() {
    const rotationDate = this.getTodayAtMidnightUTC();

    logger.log(
      `Starting task rotation for date: ${rotationDate.toISOString()}`,
      'TaskRotationScheduler'
    );

    const colocations = await this.colocationRepository.findByRotationDate(rotationDate);
    for (const colocation of colocations) {
      await this.rotateColocationTasks(colocation);
    }
  }

  private getTodayAtMidnightUTC(): Date {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    return now;
  }

  private async rotateColocationTasks(colocation: Colocation) {
    try {
      const tasks = await this.colocationTaskRepository.findByColocationId(colocation.id);
      const recurringTasks = tasks.filter((task) => task.isRecurrent);

      if (recurringTasks.length === 0) {
        logger.log(
          `No recurring tasks to rotate for colocation with id : ${colocation.id}`,
          'TaskRotationScheduler'
        );
        return;
      }

      const members = colocation.members || [];
      if (members.length === 0) {
        logger.warn(
          `No members found in colocation with id : ${colocation.id}`,
          'TaskRotationScheduler'
        );
        return;
      }

      await this.rotateTasksForMembers(recurringTasks, members, colocation.id);
      await this.updateColocationNextRotationDate(colocation);

      logger.log(
        `Successfully rotated tasks for colocation with id : ${colocation.id}. Next rotation date : ${colocation.nextRotationDate.toISOString()}`,
        'TaskRotationScheduler'
      );
    } catch (error) {
      logger.error({
        message: `Error rotating tasks for colocation with id : ${colocation.id}`,
        error: error.stack,
        context: 'TaskRotationScheduler',
      });
    }
  }

  private async rotateTasksForMembers(recurringTasks: any[], members: any[], colocationId: number) {
    const sortedMembers = this.sortMembersById(members);

    for (const task of recurringTasks) {
      const nextAssignee = this.getNextAssignee(task, sortedMembers);

      task.status = ColocationTaskStatus.TODO;
      task.assignedToId = nextAssignee.id;

      const savedTask = await this.colocationTaskRepository.save(task);

      logger.log(
        `Task with id : ${savedTask.id} reassigned to user with id : ${savedTask.assignedToId} in colocation with id : ${colocationId}`,
        'TaskRotationScheduler'
      );
    }
  }

  private sortMembersById(members: any[]): any[] {
    return members.sort((a, b) => a.id - b.id);
  }

  private getNextAssignee(task: any, sortedMembers: any[]): any {
    const currentAssigneeIndex = sortedMembers.findIndex(
      (member) => member.id === task.assignedToId
    );
    const nextAssigneeIndex = (currentAssigneeIndex + 1) % sortedMembers.length;
    return sortedMembers[nextAssigneeIndex];
  }

  private async updateColocationNextRotationDate(colocation: any) {
    colocation.setNextRotationDate();
    await this.colocationRepository.save(colocation);
  }
}
