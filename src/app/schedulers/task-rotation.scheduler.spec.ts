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

      expect(taskRepo.findByColocationId).toHaveBeenCalledWith(mockColocationEntity.id, {
        userPreferences: true,
        assignedTo: true,
      });
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

  describe('getTodayAtMidnightUTC', () => {
    it('should return today date at midnight UTC', () => {
      const mockDate = new Date('2025-07-17T15:30:45.123Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const result = (scheduler as any).getTodayAtMidnightUTC();

      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
      expect(result.getUTCSeconds()).toBe(0);
      expect(result.getUTCMilliseconds()).toBe(0);
      expect(result.getUTCFullYear()).toBe(2025);
      expect(result.getUTCMonth()).toBe(6); // Juillet = 6
      expect(result.getUTCDate()).toBe(17);

      jest.restoreAllMocks();
    });
  });

  describe('sortMembersById', () => {
    it('should sort members by id in ascending order', () => {
      const members = [
        { id: 30, firstname: 'Charlie' },
        { id: 10, firstname: 'Alice' },
        { id: 20, firstname: 'Bob' },
      ];

      const result = (scheduler as any).sortMembersById(members);

      expect(result).toEqual([
        { id: 10, firstname: 'Alice' },
        { id: 20, firstname: 'Bob' },
        { id: 30, firstname: 'Charlie' },
      ]);
    });

    it('should handle empty array', () => {
      const result = (scheduler as any).sortMembersById([]);
      expect(result).toEqual([]);
    });
  });

  describe('getNextAssignee', () => {
    const sortedMembers = [
      { id: 10, firstname: 'Alice' },
      { id: 20, firstname: 'Bob' },
      { id: 30, firstname: 'Charlie' },
    ];

    it('should assign to next member when current member opts out', () => {
      const task = {
        assignedToId: 10,
        userPreferences: [
          { userId: 20, isOptedIn: false }, // Bob opts out
          { userId: 30, isOptedIn: true }, // Charlie opts in
        ],
      };

      const result = (scheduler as any).getNextAssignee(task, sortedMembers);

      expect(result.id).toBe(30); // Should skip Bob and assign to Charlie
    });

    it('should assign to next member when no preferences exist', () => {
      const task = {
        assignedToId: 10,
        userPreferences: null,
      };

      const result = (scheduler as any).getNextAssignee(task, sortedMembers);

      expect(result.id).toBe(20); // Should assign to Bob (next after Alice)
    });

    it('should assign to next member when preferences are empty', () => {
      const task = {
        assignedToId: 10,
        userPreferences: [],
      };

      const result = (scheduler as any).getNextAssignee(task, sortedMembers);

      expect(result.id).toBe(20); // Should assign to Bob (next after Alice)
    });

    it('should wrap around to first member when at end of list', () => {
      const task = {
        assignedToId: 30, // Charlie is last
        userPreferences: [],
      };

      const result = (scheduler as any).getNextAssignee(task, sortedMembers);

      expect(result.id).toBe(10); // Should wrap to Alice
    });

    it('should stay with current assignee when all other members opt out', () => {
      const task = {
        assignedToId: 10,
        userPreferences: [
          { userId: 20, isOptedIn: false }, // Bob opts out
          { userId: 30, isOptedIn: false }, // Charlie opts out
        ],
      };

      const result = (scheduler as any).getNextAssignee(task, sortedMembers);

      expect(result.id).toBe(10); // Should stay with Alice
    });

    it('should handle member not found in list', () => {
      const task = {
        assignedToId: 999, // Non-existent member
        userPreferences: [],
      };

      const result = (scheduler as any).getNextAssignee(task, sortedMembers);

      expect(result.id).toBe(10); // Should default to first member
    });

    it('should respect opt-in preferences correctly', () => {
      const task = {
        assignedToId: 10,
        userPreferences: [
          { userId: 20, isOptedIn: true }, // Bob opts in
          { userId: 30, isOptedIn: false }, // Charlie opts out
        ],
      };

      const result = (scheduler as any).getNextAssignee(task, sortedMembers);

      expect(result.id).toBe(20); // Should assign to Bob
    });
  });

  describe('updateColocationNextRotationDate', () => {
    it('should call setNextRotationDate and save colocation', async () => {
      const mockColocation = {
        setNextRotationDate: jest.fn(),
      };

      colocationRepo.save.mockResolvedValue(mockColocation as any);

      await (scheduler as any).updateColocationNextRotationDate(mockColocation);

      expect(mockColocation.setNextRotationDate).toHaveBeenCalled();
      expect(colocationRepo.save).toHaveBeenCalledWith(mockColocation);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle mixed recurring and non-recurring tasks', async () => {
      const mixedTasks = [
        { id: 1, isRecurrent: true, assignedToId: 10 },
        { id: 2, isRecurrent: false, assignedToId: 20 },
        { id: 3, isRecurrent: true, assignedToId: 30 },
      ];

      taskRepo.findByColocationId.mockResolvedValue(mixedTasks as ColocationTask[]);
      taskRepo.save.mockImplementation(async (task) => task);
      colocationRepo.save.mockResolvedValue(mockColocationEntity);

      await (scheduler as any).rotateColocationTasks(mockColocationEntity);

      // Only recurring tasks should be processed
      expect(taskRepo.save).toHaveBeenCalledTimes(2);
    });

    it('should handle colocation with single member', async () => {
      const singleMemberColocation = {
        ...mockColocationEntity,
        members: [{ id: 10, firstname: 'Alice' }],
      };

      const task = { id: 1, isRecurrent: true, assignedToId: 10, userPreferences: [] };
      taskRepo.findByColocationId.mockResolvedValue([task as ColocationTask]);
      taskRepo.save.mockImplementation(async (task) => task);
      colocationRepo.save.mockResolvedValue(singleMemberColocation as Colocation);

      await (scheduler as any).rotateColocationTasks(singleMemberColocation);

      // Task should stay with the same member
      expect(task.assignedToId).toBe(10);
      expect(taskRepo.save).toHaveBeenCalledWith(task);
    });

    it('should process multiple colocations correctly', async () => {
      const colocation2 = mockColocationEntity;
      colocation2.id = 2;
      colocation2.members = [{ id: 100, firstname: 'David' } as User];

      jest.spyOn(scheduler as any, 'getTodayAtMidnightUTC').mockReturnValue(baseDate);
      colocationRepo.findByRotationDate.mockResolvedValue([mockColocationEntity, colocation2]);
      jest.spyOn(scheduler as any, 'rotateColocationTasks').mockResolvedValue(undefined);

      await scheduler.rotateTasks();

      expect((scheduler as any).rotateColocationTasks).toHaveBeenCalledTimes(2);
      expect((scheduler as any).rotateColocationTasks).toHaveBeenCalledWith(mockColocationEntity);
      expect((scheduler as any).rotateColocationTasks).toHaveBeenCalledWith(colocation2);
    });
  });

  describe('Error handling', () => {
    it('should handle error in task save operation', async () => {
      taskRepo.findByColocationId.mockResolvedValue([mockTask1]);
      taskRepo.save.mockRejectedValue(new Error('Save failed'));

      await (scheduler as any).rotateColocationTasks(mockColocationEntity);

      expect(logger.error).toHaveBeenCalledWith({
        message: `Error rotating tasks for colocation with id : ${mockColocationEntity.id}`,
        error: expect.any(String),
        context: 'TaskRotationScheduler',
      });
    });
  });
});
