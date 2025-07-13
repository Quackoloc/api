import { Test, TestingModule } from '@nestjs/testing';

import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../../../src/app/colocations/domain/gateways/colocation-task.repository.gateway';
import { ColocationTask } from '../../../src/app/colocations/domain/entities/colocation-task.entity';
import { ColocationTaskStatus } from '../../../src/app/colocations/domain/enums/colocation-task-status.enum';
import { logger } from '../../../src/config/logger.config';
import { ResetTaskScheduler } from '../../../src/app/schedulers/reset-task.scheduler';

jest.mock('../../../src/config/logger.config', () => ({
  logger: {
    log: jest.fn(),
  },
}));

describe('ResetTaskScheduler', () => {
  let scheduler: ResetTaskScheduler;
  let taskRepository: jest.Mocked<ColocationTaskRepositoryGateway>;

  const mockTasks: ColocationTask[] = [];
  const baseDate = new Date('2023-01-01T00:00:00.000Z');

  beforeEach(async () => {
    const task1 = new ColocationTask();
    task1.id = 1;
    task1.status = ColocationTaskStatus.DOING;
    task1.frequency = 7;
    task1.dueDate = new Date(baseDate.getTime());
    mockTasks.push(task1);

    const mockRepo = {
      findTasksToReset: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetTaskScheduler,
        {
          provide: ColocationTaskRepositoryToken,
          useValue: mockRepo,
        },
      ],
    }).compile();

    scheduler = module.get<ResetTaskScheduler>(ResetTaskScheduler);
    taskRepository = module.get(ColocationTaskRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockTasks.length = 0;
  });

  it('should reset tasks status and update dueDate', async () => {
    taskRepository.findTasksToReset.mockResolvedValue(mockTasks);
    taskRepository.save.mockImplementation(async (task) => task);

    await scheduler.resetTask();

    expect(taskRepository.findTasksToReset).toHaveBeenCalledWith(expect.any(Date));

    for (const task of mockTasks) {
      expect(task.status).toBe(ColocationTaskStatus.TODO);
      expect(task.dueDate.getTime()).toBe(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      expect(taskRepository.save).toHaveBeenCalledWith(task);
      expect(logger.log).toHaveBeenCalledWith(
        expect.stringContaining(`Task with id : ${task.id} reseted with new due date :`)
      );
    }
  });

  it('should skip tasks with undefined frequency', async () => {
    const taskWithoutFreq = new ColocationTask();
    taskWithoutFreq.id = 2;
    taskWithoutFreq.status = ColocationTaskStatus.DOING;
    taskWithoutFreq.frequency = undefined as any;
    taskWithoutFreq.dueDate = new Date(baseDate.getTime());

    taskRepository.findTasksToReset.mockResolvedValue([taskWithoutFreq]);
    taskRepository.save.mockImplementation(async (task) => task);

    await scheduler.resetTask();

    expect(taskRepository.save).not.toHaveBeenCalled();
    expect(logger.log).not.toHaveBeenCalled();
  });

  it('should propagate error if repository.save fails', async () => {
    taskRepository.findTasksToReset.mockResolvedValue(mockTasks);
    const error = new Error('Save failed');
    taskRepository.save.mockRejectedValue(error);

    await expect(scheduler.resetTask()).rejects.toThrow(error);
  });
});
