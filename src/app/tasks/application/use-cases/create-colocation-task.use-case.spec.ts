import { Test, TestingModule } from '@nestjs/testing';
import { CreateColocationTaskUseCase } from './create-colocation-task.use-case';
import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../../domain/gateways/colocation-task.repository.gateway';
import { CreateColocationTaskDto } from '../dtos/create-colocation-task.dto';
import { ColocationTask } from '../../domain/entities/colocation-task.entity';
import { ColocationTaskDto } from '../dtos/colocation-task.dto';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import { logger } from '../../../../config/logger.config';
import { ColocationTaskPriority } from '../../domain/enums/colocation-task-priority.enum';
import { ColocationTaskStatus } from '../../domain/enums/colocation-task-status.enum';
import {
  ColocationRepositoryGateway,
  ColocationRepositoryToken,
} from '../../../colocations/domain/gateways/colocation.repository.gateway';
import { User } from '../../../user/domain/entities/user.entity';
import { Colocation } from '../../../colocations/domain/entities/colocation.entity';

jest.mock('../../../../config/logger.config', () => ({
  logger: {
    log: jest.fn(),
  },
}));

describe('CreateColocationTaskUseCase', () => {
  let useCase: CreateColocationTaskUseCase;
  let taskRepository: jest.Mocked<ColocationTaskRepositoryGateway>;
  let colocationRepository: jest.Mocked<ColocationRepositoryGateway>;

  const mockColocationId = 1;
  const mockConnectedUser: ConnectedUser = { id: 42 };

  const mockCreateDto: CreateColocationTaskDto = {
    isRecurrent: false,
    title: 'Sortir les poubelles',
    description: 'À faire avant mardi',
    dueDate: new Date(),
    priority: ColocationTaskPriority.LOW,
    assignToId: 99,
  };

  const mockTaskEntity = new ColocationTask();
  mockTaskEntity.id = 123;
  mockTaskEntity.title = mockCreateDto.title;
  mockTaskEntity.description = mockCreateDto.description;
  mockTaskEntity.dueDate = mockCreateDto.dueDate;
  mockTaskEntity.priority = mockCreateDto.priority;
  mockTaskEntity.status = ColocationTaskStatus.TODO;
  mockTaskEntity.assignedToId = mockCreateDto.assignToId;
  mockTaskEntity.colocationId = mockColocationId;
  mockTaskEntity.dates = {
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockTaskDto = new ColocationTaskDto({
    id: mockTaskEntity.id,
    status: mockTaskEntity.status,
    title: mockTaskEntity.title,
    description: mockTaskEntity.description,
    dueDate: mockTaskEntity.dueDate,
    colocationId: mockTaskEntity.colocationId,
    assignedToId: mockTaskEntity.assignedToId,
  });

  beforeEach(async () => {
    taskRepository = {
      save: jest.fn(),
      findByColocationId: jest.fn(),
    } as any;

    colocationRepository = {
      getById: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateColocationTaskUseCase,
        {
          provide: ColocationTaskRepositoryToken,
          useValue: taskRepository,
        },
        {
          provide: ColocationRepositoryToken,
          useValue: colocationRepository,
        },
      ],
    }).compile();

    useCase = module.get(CreateColocationTaskUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should create a new task and return its dto', async () => {
    jest.spyOn(ColocationTaskDto, 'fromEntity').mockReturnValue(mockTaskDto);
    taskRepository.save.mockResolvedValue(mockTaskEntity);

    const result = await useCase.execute(mockColocationId, mockCreateDto, mockConnectedUser);

    expect(taskRepository.save).toHaveBeenCalled();
    expect(ColocationTaskDto.fromEntity).toHaveBeenCalledWith(mockTaskEntity);
    expect(logger.log).toHaveBeenCalledWith(
      `Colocation task with id : ${mockTaskEntity.id} created in colocation with id : ${mockColocationId} by user with id : ${mockConnectedUser.id}`,
      'CreateColocationTaskUseCase'
    );
    expect(result).toEqual(mockTaskDto);
  });

  it('should use connected user id if assignToId is not provided', async () => {
    const dtoWithoutAssignTo = { ...mockCreateDto, assignToId: undefined };
    const taskWithConnectedUserId = { ...mockTaskEntity, assignedToId: mockConnectedUser.id };

    jest.spyOn(ColocationTaskDto, 'fromEntity').mockReturnValue(mockTaskDto);
    taskRepository.save.mockResolvedValue(taskWithConnectedUserId);
    taskRepository.findByColocationId.mockResolvedValue([]);
    // todo: créer des builders pour les mocks / stubs
    colocationRepository.getById.mockResolvedValue({
      members: [{ id: mockConnectedUser.id } as User],
    } as Colocation);

    await useCase.execute(mockColocationId, dtoWithoutAssignTo, mockConnectedUser);

    expect(taskRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ assignedToId: mockConnectedUser.id })
    );
  });

  it('should propagate errors from repository', async () => {
    const error = new Error('DB error');
    taskRepository.save.mockRejectedValue(error);

    await expect(
      useCase.execute(mockColocationId, mockCreateDto, mockConnectedUser)
    ).rejects.toThrow(error);
  });

  it('should assign task to user with the fewest tasks', async () => {
    const dtoWithoutAssignTo = {
      isRecurrent: mockCreateDto.isRecurrent,
      title: mockCreateDto.title,
      description: mockCreateDto.description,
      dueDate: mockCreateDto.dueDate,
      priority: mockCreateDto.priority,
    };

    const members = [
      { id: 1 } as User,
      { id: 2 } as User,
      { id: 3 },
      { id: mockConnectedUser.id } as User,
    ];

    const tasks = [
      { assignedToId: 1 },
      { assignedToId: 1 },
      { assignedToId: 2 },
    ] as ColocationTask[];

    colocationRepository.getById.mockResolvedValue({ members } as Colocation);
    taskRepository.findByColocationId.mockResolvedValue(tasks);
    taskRepository.save.mockImplementation(async (task) => {
      return { ...mockTaskEntity, assignedToId: task.assignedToId };
    });

    const result = await useCase.execute(mockColocationId, dtoWithoutAssignTo, mockConnectedUser);

    expect(result.assignedToId).toBe(mockConnectedUser.id);
  });

  it('should prefer connected user when tied on task count', async () => {
    const dtoWithoutAssignTo = { ...mockCreateDto, assignToId: undefined };

    const members = [{ id: 42 } as User, { id: 1 } as User];

    const tasks = [{ assignedToId: 42 }, { assignedToId: 1 }] as ColocationTask[];

    colocationRepository.getById.mockResolvedValue({ members } as Colocation);
    taskRepository.findByColocationId.mockResolvedValue(tasks);
    taskRepository.save.mockImplementation(async (task) => {
      return { ...mockTaskEntity, assignedToId: task.assignedToId };
    });

    const result = await useCase.execute(mockColocationId, dtoWithoutAssignTo, mockConnectedUser);

    expect(result.assignedToId).toBe(42);
  });

  it('should assign to connected user if no members', async () => {
    const dtoWithoutAssignTo = { ...mockCreateDto, assignToId: undefined };

    colocationRepository.getById.mockResolvedValue({ members: [] } as Colocation);
    taskRepository.findByColocationId.mockResolvedValue([]);
    taskRepository.save.mockImplementation(async (task) => {
      return { ...mockTaskEntity, assignedToId: task.assignedToId };
    });

    const result = await useCase.execute(mockColocationId, dtoWithoutAssignTo, mockConnectedUser);

    expect(result.assignedToId).toBe(mockConnectedUser.id);
  });
});
