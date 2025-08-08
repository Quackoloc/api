import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserProfileUseCase } from './update-user-profile.use-case';
import {
  UserRepositoryGateway,
  UserRepositoryToken,
} from '../../domain/gateways/user.repository.gateway';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import { User } from '../../domain/entities/user.entity';
import { UserEmailAlreadyExistsException } from '../../domain/user-exceptions';

describe('UpdateUserProfileUseCase', () => {
  let useCase: UpdateUserProfileUseCase;
  let userRepository: jest.Mocked<UserRepositoryGateway>;

  const mockUser = new User();
  mockUser.id = 1;
  mockUser.email = 'old@example.com';
  mockUser.firstname = 'Old';
  mockUser.lastname = 'Name';
  mockUser.avatar = 'old-avatar.jpg';
  mockUser.password = 'hashedPassword';
  mockUser.dates = {
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };
  mockUser.hashPasswordBeforeInsert = jest.fn();

  const connectedUser: ConnectedUser = {
    id: 1,
    // Add other required properties of ConnectedUser
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserProfileUseCase,
        {
          provide: UserRepositoryToken,
          useValue: {
            getById: jest.fn(),
            findOneByEmail: jest.fn(),
            save: jest.fn().mockImplementation(async (user) => user),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateUserProfileUseCase>(UpdateUserProfileUseCase);
    userRepository = module.get(UserRepositoryToken);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update user profile with provided fields', async () => {
      // Arrange
      const updateDto: UpdateUserDto = {
        email: 'new@example.com',
        firstname: 'New',
        lastname: 'Name',
      };

      const savedUser = { ...mockUser };
      userRepository.getById.mockResolvedValue(savedUser as User);
      userRepository.findOneByEmail.mockResolvedValue(null);

      // Act
      await useCase.execute(updateDto, connectedUser);

      // Assert
      expect(userRepository.getById).toHaveBeenCalledWith(connectedUser.id);
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: updateDto.email,
          firstname: updateDto.firstname,
          lastname: updateDto.lastname,
        })
      );
    });

    it('should throw UserEmailAlreadyExistsException when email already exists for another user', async () => {
      // Arrange
      const updateDto: UpdateUserDto = {
        email: 'existing@example.com',
      };

      const existingUser = new User();
      existingUser.id = 2; // Different user ID
      existingUser.email = 'existing@example.com';

      userRepository.getById.mockResolvedValue(mockUser);
      userRepository.findOneByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(useCase.execute(updateDto, connectedUser)).rejects.toThrow(
        UserEmailAlreadyExistsException
      );
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should allow updating to same email', async () => {
      // Arrange
      const updateDto: UpdateUserDto = {
        email: 'old@example.com', // Same as mockUser.email
      };

      userRepository.getById.mockResolvedValue(mockUser);
      // No need to mock findOneByEmail as it shouldn't be called

      // Act
      await useCase.execute(updateDto, connectedUser);

      // Assert
      expect(userRepository.findOneByEmail).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled(); // No changes
    });

    it('should update only provided fields', async () => {
      // Arrange
      const updateDto: UpdateUserDto = {
        firstname: 'NewFirstname',
        // email and lastname not provided
      };

      const savedUser = { ...mockUser };
      userRepository.getById.mockResolvedValue(savedUser as User);
      userRepository.findOneByEmail.mockResolvedValue(null);

      // Act
      await useCase.execute(updateDto, connectedUser);

      // Assert
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockUser.email, // unchanged
          firstname: updateDto.firstname, // updated
          lastname: mockUser.lastname, // unchanged
        })
      );
    });

    it('should not call save when no fields to update', async () => {
      // Arrange
      const updateDto: UpdateUserDto = {}; // empty DTO
      userRepository.getById.mockResolvedValue(mockUser);

      // Act
      await useCase.execute(updateDto, connectedUser);

      // Assert
      expect(userRepository.getById).toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });
});
