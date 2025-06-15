import { Test, TestingModule } from '@nestjs/testing';
import { ChangeColocationTaskStatusUseCase } from '../../../src/app/colocations/application/use-cases/change-colocation-task-status.use-case';
import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../../../src/app/colocations/domain/gateways/colocation-task.repository.gateway';
import { ConnectedUser } from '../../../src/common/types/connected-user.type';
import { ColocationTask } from '../../../src/app/colocations/domain/entities/colocation-task.entity';
import { ColocationTaskStatus } from '../../../src/app/colocations/domain/enums/colocation-task-status.enum';

describe('ChangeColocationTaskStatusUseCase', () => {
  let useCase: ChangeColocationTaskStatusUseCase;
  let taskRepository: jest.Mocked<ColocationTaskRepositoryGateway>;

  const mockColocationId = 1;
  const mockTaskId = 10;
  const mockUser: ConnectedUser = { id: 42 };
  const mockStatus = ColocationTaskStatus.DONE;

  const mockTaskEntity = new ColocationTask();
  mockTaskEntity.id = mockTaskId;
  mockTaskEntity.status = ColocationTaskStatus.TODO;
  mockTaskEntity.colocationId = mockColocationId;

  beforeEach(async () => {
    const mockRepository = {
      getOneById: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeColocationTaskStatusUseCase,
        {
          provide: ColocationTaskRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get(ChangeColocationTaskStatusUseCase);
    taskRepository = module.get(ColocationTaskRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should change the task status and save it', async () => {
    taskRepository.getOneById.mockResolvedValue(mockTaskEntity);
    taskRepository.save.mockResolvedValue(undefined);

    await useCase.execute(mockColocationId, mockTaskId, mockStatus, mockUser);

    expect(taskRepository.getOneById).toHaveBeenCalledWith(mockTaskId);
    expect(mockTaskEntity.status).toBe(mockStatus);
    expect(taskRepository.save).toHaveBeenCalledWith(mockTaskEntity);
  });

  it('should propagate error if getOneById throws', async () => {
    const error = new Error('Not found');
    taskRepository.getOneById.mockRejectedValue(error);

    await expect(
      useCase.execute(mockColocationId, mockTaskId, mockStatus, mockUser)
    ).rejects.toThrow(error);

    expect(taskRepository.getOneById).toHaveBeenCalledWith(mockTaskId);
    expect(taskRepository.save).not.toHaveBeenCalled();
  });

  it('should propagate error if save throws', async () => {
    taskRepository.getOneById.mockResolvedValue(mockTaskEntity);
    const error = new Error('Save error');
    taskRepository.save.mockRejectedValue(error);

    await expect(
      useCase.execute(mockColocationId, mockTaskId, mockStatus, mockUser)
    ).rejects.toThrow(error);

    expect(taskRepository.getOneById).toHaveBeenCalledWith(mockTaskId);
    expect(taskRepository.save).toHaveBeenCalledWith(mockTaskEntity);
  });
});
