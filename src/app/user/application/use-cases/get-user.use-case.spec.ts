import { Test, TestingModule } from '@nestjs/testing';
import { GetUserUseCase } from './get-user.use-case';
import {
  UserRepositoryGateway,
  UserRepositoryToken,
} from '../../domain/gateways/user.repository.gateway';
import { User } from '../../domain/entities/user.entity';

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase;
  let userRepository: jest.Mocked<UserRepositoryGateway>;

  const mockUser = new User();
  mockUser.id = 1;
  mockUser.email = 'test@example.com';
  mockUser.firstname = 'John';
  mockUser.lastname = 'Doe';
  mockUser.avatar = 'avatar.jpg';
  mockUser.dates = {
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserUseCase,
        {
          provide: UserRepositoryToken,
          useValue: {
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetUserUseCase>(GetUserUseCase);
    userRepository = module.get(UserRepositoryToken);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a user when found', async () => {
      // Arrange
      const userId = 1;
      userRepository.getById.mockResolvedValue(mockUser);

      // Act
      const result = await useCase.execute(userId);

      // Assert
      expect(result).toEqual(mockUser);
      expect(userRepository.getById).toHaveBeenCalledWith(userId);
    });

    it('should call repository with correct parameters', async () => {
      // Arrange
      const userId = 1;
      userRepository.getById.mockResolvedValue(mockUser);

      // Act
      await useCase.execute(userId);

      // Assert
      expect(userRepository.getById).toHaveBeenCalledTimes(1);
      expect(userRepository.getById).toHaveBeenCalledWith(userId);
    });

    it('should return null when user is not found', async () => {
      // Arrange
      const userId = 999;
      userRepository.getById.mockResolvedValue(null);

      // Act
      const result = await useCase.execute(userId);

      // Assert
      expect(result).toBeNull();
      expect(userRepository.getById).toHaveBeenCalledWith(userId);
    });
  });
});
