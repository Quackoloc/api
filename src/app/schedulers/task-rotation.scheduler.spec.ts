import { Test, TestingModule } from '@nestjs/testing';
import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../tasks/domain/gateways/colocation-task.repository.gateway';
import {
  ColocationRepositoryGateway,
  ColocationRepositoryToken,
} from '../colocations/domain/gateways/colocation.repository.gateway';
import { ColocationTaskStatus } from '../tasks/domain/enums/colocation-task-status.enum';
import { Colocation } from '../colocations/domain/entities/colocation.entity';
import { ColocationTask } from '../tasks/domain/entities/colocation-task.entity';
import { logger } from '../../config/logger.config';
import { User } from '../user/domain/entities/user.entity';
import { TaskRotationScheduler } from './task-rotation.scheduler';

jest.mock('../../config/logger.config', () => ({
  logger: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('TaskRotationScheduler', () => {
  let scheduler: TaskRotationScheduler;
  let taskRepo: jest.Mocked<ColocationTaskRepositoryGateway>;
  let colocationRepo: jest.Mocked<ColocationRepositoryGateway>;

  const baseDate = new Date('2025-07-17T00:00:00.000Z');

  // Mock entités
  const mockColocationEntity = new Colocation();
  mockColocationEntity.id = 1;
  mockColocationEntity.title = 'Test Colocation';
  mockColocationEntity.address = '123 Test St';
  mockColocationEntity.backgroundImage = '';
  mockColocationEntity.members = [
    { id: 10, firstname: 'Alice' } as User,
    { id: 20, firstname: 'Bob' } as User,
  ];
  mockColocationEntity.setNextRotationDate = jest.fn();
  mockColocationEntity.nextRotationDate = baseDate;

  const mockTask1 = new ColocationTask();
  mockTask1.id = 1;
  mockTask1.isRecurrent = true;
  mockTask1.status = ColocationTaskStatus.DONE;
  mockTask1.assignedToId = 10;

  const mockTask2 = new ColocationTask();
  mockTask2.id = 2;
  mockTask2.isRecurrent = true;
  mockTask2.status = ColocationTaskStatus.DONE;
  mockTask2.assignedToId = 20;

  beforeEach(async () => {
    const mockTaskRepository = {
      findByColocationId: jest.fn(),
      save: jest.fn(),
    };
    const mockColocationRepository = {
      findByRotationDate: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskRotationScheduler,
        {
          provide: ColocationTaskRepositoryToken,
          useValue: mockTaskRepository,
        },
        {
          provide: ColocationRepositoryToken,
          useValue: mockColocationRepository,
        },
      ],
    }).compile();

    scheduler = module.get<TaskRotationScheduler>(TaskRotationScheduler);
    taskRepo = module.get(ColocationTaskRepositoryToken);
    colocationRepo = module.get(ColocationRepositoryToken);

    jest.clearAllMocks();
  });

  describe('rotateTasks', () => {
    it('should call findByRotationDate and rotate tasks', async () => {
      jest.spyOn(scheduler as any, 'getTodayAtMidnightUTC').mockReturnValue(baseDate);
      colocationRepo.findByRotationDate.mockResolvedValue([mockColocationEntity]);
      jest.spyOn(scheduler as any, 'rotateColocationTasks').mockResolvedValue(undefined);

      await scheduler.rotateTasks();

      expect(colocationRepo.findByRotationDate).toHaveBeenCalledWith(baseDate);
      expect((scheduler as any).rotateColocationTasks).toHaveBeenCalledWith(mockColocationEntity);
      expect(logger.log).toHaveBeenCalledWith(
        `Starting task rotation for date: ${baseDate.toISOString()}`,
        'TaskRotationScheduler'
      );
    });
  });

  describe('rotateColocationTasks', () => {
    it('should rotate recurring tasks and update colocation', async () => {
      taskRepo.findByColocationId.mockResolvedValue([mockTask1, mockTask2]);
      taskRepo.save.mockImplementation(async (task) => task);
      colocationRepo.save.mockResolvedValue(mockColocationEntity);

      await (scheduler as any).rotateColocationTasks(mockColocationEntity);

      expect(taskRepo.findByColocationId).toHaveBeenCalledWith(mockColocationEntity.id);
      expect(taskRepo.save).toHaveBeenCalledTimes(2);
      expect(mockColocationEntity.setNextRotationDate).toHaveBeenCalled();
      expect(colocationRepo.save).toHaveBeenCalledWith(mockColocationEntity);

      expect(mockTask1.status).toBe(ColocationTaskStatus.TODO);
      expect(mockTask2.status).toBe(ColocationTaskStatus.TODO);
      expect([10, 20]).toContain(mockTask1.assignedToId);
      expect(logger.log).toHaveBeenCalledWith(
        expect.stringContaining(
          `Successfully rotated tasks for colocation with id : ${mockColocationEntity.id}`
        ),
        'TaskRotationScheduler'
      );
    });

    it('should log and return if no recurring tasks', async () => {
      taskRepo.findByColocationId.mockResolvedValue([{ isRecurrent: false } as any]);

      await (scheduler as any).rotateColocationTasks(mockColocationEntity);

      expect(logger.log).toHaveBeenCalledWith(
        `No recurring tasks to rotate for colocation with id : ${mockColocationEntity.id}`,
        'TaskRotationScheduler'
      );
    });

    it('should warn and return if no members', async () => {
      const colocationNoMembers = { ...mockColocationEntity, members: [] };
      taskRepo.findByColocationId.mockResolvedValue([mockTask1]);

      await (scheduler as any).rotateColocationTasks(colocationNoMembers);

      expect(logger.warn).toHaveBeenCalledWith(
        `No members found in colocation with id : ${colocationNoMembers.id}`,
        'TaskRotationScheduler'
      );
    });

    it('should catch and log errors', async () => {
      const error = new Error('fail');
      taskRepo.findByColocationId.mockRejectedValue(error);

      await (scheduler as any).rotateColocationTasks(mockColocationEntity);

      expect(logger.error).toHaveBeenCalledWith({
        message: `Error rotating tasks for colocation with id : ${mockColocationEntity.id}`,
        error: error.stack,
        context: 'TaskRotationScheduler',
      });
    });
  });

  describe('rotateTasksForMembers', () => {
    it('should assign next assignee and save tasks', async () => {
      const recurringTasks = [
        { id: 1, isRecurrent: true, status: ColocationTaskStatus.DONE, assignedToId: 10 },
        { id: 2, isRecurrent: true, status: ColocationTaskStatus.DONE, assignedToId: 20 },
      ];
      const members = [{ id: 10 }, { id: 20 }, { id: 30 }];

      taskRepo.save.mockImplementation(async (task) => task);

      await (scheduler as any).rotateTasksForMembers(recurringTasks, members, 1);

      expect(taskRepo.save).toHaveBeenCalledTimes(2);

      expect(recurringTasks[0].status).toBe(ColocationTaskStatus.TODO);
      expect(recurringTasks[1].status).toBe(ColocationTaskStatus.TODO);
      expect([10, 20, 30]).toContain(recurringTasks[0].assignedToId);
      expect(logger.log).toHaveBeenCalledWith(
        expect.stringContaining('Task with id : 1 reassigned to user with id :'),
        'TaskRotationScheduler'
      );
    });
  });
});
