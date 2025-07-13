import { Test, TestingModule } from '@nestjs/testing';
import { GetColocationTasksUseCase } from './get-colocation-tasks.use-case';
import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../../domain/gateways/colocation-task.repository.gateway';
import { ColocationTaskDto } from '../dtos/colocation-task.dto';
import { ColocationTask } from '../../domain/entities/colocation-task.entity';
import { ColocationTaskStatus } from '../../domain/enums/colocation-task-status.enum';

describe('GetColocationTasksUseCase', () => {
  let useCase: GetColocationTasksUseCase;
  let taskRepository: jest.Mocked<ColocationTaskRepositoryGateway>;

  const mockColocationId = 1;

  const mockTaskEntity = new ColocationTask();
  mockTaskEntity.id = 1;
  mockTaskEntity.status = ColocationTaskStatus.DOING;
  mockTaskEntity.title = 'Faire la vaisselle';
  mockTaskEntity.description = '';
  mockTaskEntity.dueDate = new Date();
  mockTaskEntity.colocationId = mockColocationId;
  mockTaskEntity.assignedToId = 42;
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
    const mockRepository = {
      findByColocationId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetColocationTasksUseCase,
        {
          provide: ColocationTaskRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetColocationTasksUseCase>(GetColocationTasksUseCase);
    taskRepository = module.get(ColocationTaskRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return task dtos from the repository', async () => {
    jest.spyOn(ColocationTaskDto, 'fromEntity').mockReturnValue(mockTaskDto);

    taskRepository.findByColocationId.mockResolvedValue([mockTaskEntity]);

    const result = await useCase.execute(mockColocationId);

    expect(taskRepository.findByColocationId).toHaveBeenCalledWith(mockColocationId);
    expect(ColocationTaskDto.fromEntity).toHaveBeenCalledWith(mockTaskEntity);
    expect(result).toEqual([mockTaskDto]);
  });

  it('should return empty array if no tasks found', async () => {
    jest.spyOn(ColocationTaskDto, 'fromEntity');

    taskRepository.findByColocationId.mockResolvedValue([]);

    const result = await useCase.execute(mockColocationId);

    expect(taskRepository.findByColocationId).toHaveBeenCalledWith(mockColocationId);
    expect(ColocationTaskDto.fromEntity).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should propagate errors thrown by the repository', async () => {
    const error = new Error('Database error');
    taskRepository.findByColocationId.mockRejectedValue(error);

    await expect(useCase.execute(mockColocationId)).rejects.toThrow(error);
    expect(taskRepository.findByColocationId).toHaveBeenCalledWith(mockColocationId);
  });
});
