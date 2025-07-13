import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../colocations/domain/gateways/colocation-task.repository.gateway';
import { ColocationTaskStatus } from '../colocations/domain/enums/colocation-task-status.enum';
import { logger } from '../../config/logger.config';

@Injectable()
export class ResetTaskScheduler {
  constructor(
    @Inject(ColocationTaskRepositoryToken)
    private readonly colocationTaskRepository: ColocationTaskRepositoryGateway
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async resetTask() {
    const today = new Date();
    const tasks = await this.colocationTaskRepository.findTasksToReset(today);
    for (const task of tasks) {
      if (!task.frequency) continue;

      task.status = ColocationTaskStatus.TODO;
      task.dueDate = new Date(task.dueDate.getTime() + task.frequency * 24 * 60 * 60 * 1000);

      const savedTask = await this.colocationTaskRepository.save(task);

      logger.log(`Task with id : ${savedTask.id} reseted with new due date : ${savedTask.dueDate}`);
    }
  }
}
