import { Test, TestingModule } from '@nestjs/testing';
import { DeleteColocationTaskUseCase } from './delete-colocation-task.use-case';
import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../../domain/gateways/colocation-task.repository.gateway';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import { logger } from '../../../../config/logger.config';

jest.mock('../../../../config/logger.config', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
  },
}));

describe('DeleteColocationTaskUseCase', () => {
  let useCase: DeleteColocationTaskUseCase;
  let colocationTaskRepository: jest.Mocked<ColocationTaskRepositoryGateway>;

  const mockConnectedUser: ConnectedUser = { id: 123 };
  const taskId = 1;

  beforeEach(async () => {
    const mockRepository = {
      deleteOneById: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteColocationTaskUseCase,
        {
          provide: ColocationTaskRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteColocationTaskUseCase>(DeleteColocationTaskUseCase);
    colocationTaskRepository = module.get(ColocationTaskRepositoryToken);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should call deleteOneById with correct taskId', async () => {
      // Act
      await useCase.execute(taskId, mockConnectedUser);

      // Assert
      expect(colocationTaskRepository.deleteOneById).toHaveBeenCalledWith(taskId);
    });

    it('should not throw when task is successfully deleted', async () => {
      // Arrange
      colocationTaskRepository.deleteOneById.mockResolvedValue(undefined);

      // Act & Assert
      await expect(useCase.execute(taskId, mockConnectedUser)).resolves.not.toThrow();
    });

    it('should log the deletion', async () => {
      // Act
      await useCase.execute(taskId, mockConnectedUser);

      // Assert
      expect(logger.log).toHaveBeenCalledWith(
        `Task with id : ${taskId} has been deleted by user with id : ${mockConnectedUser.id}`,
        'DeleteColocationTaskUseCase'
      );
    });
  });
});
