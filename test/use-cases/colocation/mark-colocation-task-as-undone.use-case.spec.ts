import { Test, TestingModule } from '@nestjs/testing';
import { MarkColocationTaskAsUndoneUseCase } from '../../../src/app/colocations/application/use-cases/mark-colocation-task-as-undone.use-case';
import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../../../src/app/colocations/domain/gateways/colocation-task.repository.gateway';
import { ConnectedUser } from '../../../src/common/types/connected-user.type';
import { ColocationTask } from '../../../src/app/colocations/domain/entities/colocation-task.entity';

describe('MarkColocationTaskAsUndoneUseCase', () => {
  let useCase: MarkColocationTaskAsUndoneUseCase;
  let taskRepository: jest.Mocked<ColocationTaskRepositoryGateway>;

  const mockColocationId = 1;
  const mockTaskId = 10;
  const mockUser: ConnectedUser = { id: 42 };

  const mockTaskEntity = new ColocationTask();
  mockTaskEntity.id = mockTaskId;
  mockTaskEntity.completed = true;
  mockTaskEntity.colocationId = mockColocationId;

  beforeEach(async () => {
    const mockRepository = {
      getOneById: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarkColocationTaskAsUndoneUseCase,
        {
          provide: ColocationTaskRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<MarkColocationTaskAsUndoneUseCase>(MarkColocationTaskAsUndoneUseCase);
    taskRepository = module.get(ColocationTaskRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should mark the task as undone and save it', async () => {
    taskRepository.getOneById.mockResolvedValue(mockTaskEntity);
    taskRepository.save.mockResolvedValue(undefined);

    await useCase.execute(mockColocationId, mockTaskId, mockUser);

    expect(taskRepository.getOneById).toHaveBeenCalledWith(mockTaskId);
    expect(mockTaskEntity.completed).toBe(false);
    expect(taskRepository.save).toHaveBeenCalledWith(mockTaskEntity);
  });

  it('should propagate error if getOneById throws', async () => {
    const error = new Error('Not found');
    taskRepository.getOneById.mockRejectedValue(error);

    await expect(useCase.execute(mockColocationId, mockTaskId, mockUser)).rejects.toThrow(error);
    expect(taskRepository.getOneById).toHaveBeenCalledWith(mockTaskId);
    expect(taskRepository.save).not.toHaveBeenCalled();
  });

  it('should propagate error if save throws', async () => {
    taskRepository.getOneById.mockResolvedValue(mockTaskEntity);
    const error = new Error('Save error');
    taskRepository.save.mockRejectedValue(error);

    await expect(useCase.execute(mockColocationId, mockTaskId, mockUser)).rejects.toThrow(error);
    expect(taskRepository.getOneById).toHaveBeenCalledWith(mockTaskId);
    expect(taskRepository.save).toHaveBeenCalledWith(mockTaskEntity);
  });
});
