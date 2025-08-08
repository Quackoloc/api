import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordUseCase } from './reset-password.use-case';
import {
  UserRepositoryGateway,
  UserRepositoryToken,
} from '../../domain/gateways/user.repository.gateway';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { User } from '../../domain/entities/user.entity';
import { ConnectedUser } from '../../../../common/types/connected-user.type';

describe('ResetPasswordUseCase', () => {
  let useCase: ResetPasswordUseCase;
  let userRepository: jest.Mocked<UserRepositoryGateway>;

  const mockUser = new User();
  mockUser.id = 1;
  mockUser.email = 'test@example.com';
  mockUser.password = 'oldHashedPassword';
  mockUser.generatePasswordHash = jest.fn().mockResolvedValue('newHashedPassword');

  const resetPasswordDto: ResetPasswordDto = {
    newPassword: 'newPassword123!',
  };

  const connectedUser: ConnectedUser = {
    id: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetPasswordUseCase,
        {
          provide: UserRepositoryToken,
          useValue: {
            getById: jest.fn().mockResolvedValue(mockUser),
            save: jest.fn().mockImplementation(async (user) => user),
          },
        },
      ],
    }).compile();

    useCase = module.get<ResetPasswordUseCase>(ResetPasswordUseCase);
    userRepository = module.get(UserRepositoryToken);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should reset password successfully', async () => {
      await useCase.execute(resetPasswordDto, connectedUser);

      expect(userRepository.getById).toHaveBeenCalledWith(connectedUser.id);
      expect(mockUser.generatePasswordHash).toHaveBeenCalledWith(resetPasswordDto.newPassword);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockUser.password).toBe('newHashedPassword');
    });

    it('should update the password with a new hashed value', async () => {
      // Arrange
      const originalHash = mockUser.password;
      let savedUser: User;

      userRepository.save.mockImplementationOnce(async (user) => {
        savedUser = user;
        return user;
      });

      const mockHash = `hashed_${Date.now()}`;
      mockUser.generatePasswordHash = jest.fn().mockResolvedValue(mockHash);

      // Act
      await useCase.execute(resetPasswordDto, connectedUser);

      // Assert
      expect(savedUser!).toBeDefined();
      expect(savedUser!.password).not.toBe(originalHash);
      expect(savedUser!.password).not.toBe(resetPasswordDto.newPassword);
      expect(savedUser!.password).toBe(mockHash);
      expect(mockUser.generatePasswordHash).toHaveBeenCalledWith(resetPasswordDto.newPassword);
    });

    it('should call generatePasswordHash with the new password', async () => {
      await useCase.execute(resetPasswordDto, connectedUser);

      expect(mockUser.generatePasswordHash).toHaveBeenCalledWith(resetPasswordDto.newPassword);
    });
  });
});
