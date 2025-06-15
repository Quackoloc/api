import { Test, TestingModule } from '@nestjs/testing';
import { CreateColocationTaskUseCase } from '../../../src/app/colocations/application/use-cases/create-colocation-task.use-case';
import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../../../src/app/colocations/domain/gateways/colocation-task.repository.gateway';
import { CreateColocationTaskDto } from '../../../src/app/colocations/application/dtos/create-colocation-task.dto';
import { ColocationTask } from '../../../src/app/colocations/domain/entities/colocation-task.entity';
import { ColocationTaskDto } from '../../../src/app/colocations/application/dtos/colocation-task.dto';
import { ConnectedUser } from '../../../src/common/types/connected-user.type';
import { logger } from '../../../src/common/logger';
import { ColocationTaskPriority } from '../../../src/app/colocations/domain/enums/colocation-task.priority';

jest.mock('../../../src/common/logger', () => ({
  logger: {
    info: jest.fn(),
  },
}));

describe('CreateColocationTaskUseCase', () => {
  let useCase: CreateColocationTaskUseCase;
  let taskRepository: jest.Mocked<ColocationTaskRepositoryGateway>;

  const mockColocationId = 1;
  const mockConnectedUser: ConnectedUser = { id: 42 };

  const mockCreateDto: CreateColocationTaskDto = {
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
  mockTaskEntity.completed = false;
  mockTaskEntity.assignedToId = mockCreateDto.assignToId;
  mockTaskEntity.colocationId = mockColocationId;
  mockTaskEntity.dates = {
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockTaskDto = new ColocationTaskDto({
    id: mockTaskEntity.id,
    completed: false,
    title: mockTaskEntity.title,
    description: mockTaskEntity.description,
    dueDate: mockTaskEntity.dueDate,
    colocationId: mockTaskEntity.colocationId,
    assignedToId: mockTaskEntity.assignedToId,
  });

  beforeEach(async () => {
    const mockRepo = {
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateColocationTaskUseCase,
        {
          provide: ColocationTaskRepositoryToken,
          useValue: mockRepo,
        },
      ],
    }).compile();

    useCase = module.get(CreateColocationTaskUseCase);
    taskRepository = module.get(ColocationTaskRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new task and return its dto', async () => {
    jest.spyOn(ColocationTaskDto, 'fromEntity').mockReturnValue(mockTaskDto);
    taskRepository.save.mockResolvedValue(mockTaskEntity);

    const result = await useCase.execute(mockColocationId, mockCreateDto, mockConnectedUser);

    expect(taskRepository.save).toHaveBeenCalled();
    expect(ColocationTaskDto.fromEntity).toHaveBeenCalledWith(mockTaskEntity);
    expect(logger.info).toHaveBeenCalledWith(
      `Colocation task with id : ${mockTaskEntity.id} created in colocation with id : ${mockColocationId} by user with id : ${mockConnectedUser.id}`
    );
    expect(result).toEqual(mockTaskDto);
  });

  it('should use connected user id if assignToId is not provided', async () => {
    const dtoWithoutAssignTo = { ...mockCreateDto, assignToId: undefined };
    const taskWithConnectedUserId = { ...mockTaskEntity, assignedToId: mockConnectedUser.id };

    jest.spyOn(ColocationTaskDto, 'fromEntity').mockReturnValue(mockTaskDto);
    taskRepository.save.mockResolvedValue(taskWithConnectedUserId);

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
});
