import { Test, TestingModule } from '@nestjs/testing';
import { ValidateUserUseCase } from './validate-user.use-case';
import {
  UserRepositoryGateway,
  UserRepositoryToken,
} from '../../../user/domain/gateways/user.repository.gateway';
import { User } from '../../../user/domain/entities/user.entity';
import { UserDto } from '../../../user/application/dtos/user.dto';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('ValidateUserUseCase', () => {
  let useCase: ValidateUserUseCase;
  let userRepository: jest.Mocked<UserRepositoryGateway>;

  const mockUser = new User();
  mockUser.id = 123;
  mockUser.email = 'john@example.com';
  mockUser.avatar = 'avatar.png';
  mockUser.lastname = 'Doe';
  mockUser.firstname = 'John';
  mockUser.password = 'hashedPassword123';
  mockUser.colocation = null;
  mockUser.dates = {
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const mockUserRepository = {
      getOneByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateUserUseCase,
        {
          provide: UserRepositoryToken,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<ValidateUserUseCase>(ValidateUserUseCase);
    userRepository = module.get(UserRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return UserDto if password matches', async () => {
      // Arrange
      userRepository.getOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      const fromEntitySpy = jest
        .spyOn(UserDto, 'fromEntity')
        .mockReturnValue({ id: mockUser.id } as any);

      // Act
      const result = await useCase.execute(mockUser.email, 'plainPassword');

      // Assert
      expect(userRepository.getOneByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(bcrypt.compareSync).toHaveBeenCalledWith('plainPassword', mockUser.password);
      expect(fromEntitySpy).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ id: mockUser.id });
    });

    it('should return null if password does not match', async () => {
      // Arrange
      userRepository.getOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      // Act
      const result = await useCase.execute(mockUser.email, 'wrongPassword');

      // Assert
      expect(result).toBeNull();
      expect(bcrypt.compareSync).toHaveBeenCalledWith('wrongPassword', mockUser.password);
    });

    it('should throw error if getOneByEmail fails', async () => {
      // Arrange
      const error = new Error('DB error');
      userRepository.getOneByEmail.mockRejectedValue(error);

      // Act & Assert
      await expect(useCase.execute('john@example.com', 'any')).rejects.toThrow('DB error');
    });
  });
});
