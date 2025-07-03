import { Test, TestingModule } from '@nestjs/testing';
import { UpdateColocationTaskUseCase } from '../../../src/app/colocations/application/use-cases/update-colocation-task.use-case';
import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../../../src/app/colocations/domain/gateways/colocation-task.repository.gateway';
import { UpdateColocationTaskDto } from '../../../src/app/colocations/application/dtos/update-colocation-task.dto';
import { ColocationTask } from '../../../src/app/colocations/domain/entities/colocation-task.entity';
import { ConnectedUser } from '../../../src/common/types/connected-user.type';
import { logger } from '../../../src/config/logger.config';
import { ColocationTaskPriority } from '../../../src/app/colocations/domain/enums/colocation-task-priority.enum';
import { ColocationTaskStatus } from '../../../src/app/colocations/domain/enums/colocation-task-status.enum';

jest.mock('../../../src/config/logger.config', () => ({
  logger: {
    info: jest.fn(),
  },
}));

describe('UpdateColocationTaskUseCase', () => {
  let useCase: UpdateColocationTaskUseCase;
  let taskRepository: jest.Mocked<ColocationTaskRepositoryGateway>;

  const mockColocationId = 1;
  const mockTaskId = 10;
  const connectedUser: ConnectedUser = { id: 42 };

  const existingTask = new ColocationTask();
  existingTask.id = mockTaskId;
  existingTask.title = 'Ancien titre';
  existingTask.description = 'Ancienne description';
  existingTask.dueDate = new Date('2024-01-01');
  existingTask.priority = ColocationTaskPriority.MEDIUM;
  existingTask.assignedToId = 99;
  existingTask.colocationId = mockColocationId;
  existingTask.status = ColocationTaskStatus.DOING;
  existingTask.dates = {
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const updateDto: UpdateColocationTaskDto = {
    title: 'Nouveau titre',
    description: 'Nouvelle description',
    dueDate: new Date('2025-01-01'),
    priority: ColocationTaskPriority.HIGH,
    assignToId: 77,
  };

  beforeEach(async () => {
    const mockRepo = {
      getOneById: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateColocationTaskUseCase,
        {
          provide: ColocationTaskRepositoryToken,
          useValue: mockRepo,
        },
      ],
    }).compile();

    useCase = module.get(UpdateColocationTaskUseCase);
    taskRepository = module.get(ColocationTaskRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a task with given values', async () => {
    taskRepository.getOneById.mockResolvedValue(existingTask);

    await useCase.execute(mockColocationId, mockTaskId, updateDto, connectedUser);

    expect(taskRepository.getOneById).toHaveBeenCalledWith(mockTaskId);
    expect(taskRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: mockTaskId,
        title: updateDto.title,
        description: updateDto.description,
        dueDate: updateDto.dueDate,
        priority: updateDto.priority,
        assignedToId: updateDto.assignToId,
      })
    );

    expect(logger.log).toHaveBeenCalledWith(
      `Colocation task with id : ${mockTaskId} in colocation with id : ${mockColocationId} updated by user with id : ${connectedUser.id}`
    );
  });

  it('should default assignedToId to connectedUser.id if not provided', async () => {
    const dtoWithoutAssign = { ...updateDto, assignToId: undefined };
    taskRepository.getOneById.mockResolvedValue(existingTask);

    await useCase.execute(mockColocationId, mockTaskId, dtoWithoutAssign, connectedUser);

    expect(taskRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        assignedToId: connectedUser.id,
      })
    );
  });

  it('should propagate errors from getOneById', async () => {
    const error = new Error('Not found');
    taskRepository.getOneById.mockRejectedValue(error);

    await expect(
      useCase.execute(mockColocationId, mockTaskId, updateDto, connectedUser)
    ).rejects.toThrow(error);
  });

  it('should propagate errors from save', async () => {
    taskRepository.getOneById.mockResolvedValue(existingTask);
    const error = new Error('DB error');
    taskRepository.save.mockRejectedValue(error);

    await expect(
      useCase.execute(mockColocationId, mockTaskId, updateDto, connectedUser)
    ).rejects.toThrow(error);
  });
});
