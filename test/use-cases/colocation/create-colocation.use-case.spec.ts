import { Test, TestingModule } from '@nestjs/testing';
import {
  ColocationRepositoryGateway,
  ColocationRepositoryToken,
} from '../../../src/app/colocations/domain/gateways/colocation.repository.gateway';
import {
  UserRepositoryGateway,
  UserRepositoryToken,
} from '../../../src/app/user/domain/gateways/user.repository.gateway';
import { CreateColocationUseCase } from '../../../src/app/colocations/application/use-cases/create-colocation.use-case';
import { CreateColocationDto } from '../../../src/app/colocations/application/dtos/create-colocation.dto';
import { Colocation } from '../../../src/app/colocations/domain/entities/colocation.entity';
import { ColocationDto } from '../../../src/app/colocations/application/dtos/colocation.dto';
import { User } from '../../../src/app/user/domain/entities/user.entity';

describe('CreateColocationUseCase', () => {
  let useCase: CreateColocationUseCase;
  let colocationRepository: jest.Mocked<ColocationRepositoryGateway>;
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
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    deletedAt: null,
  };

  const mockCreateColocationDto: CreateColocationDto = {
    title: 'My Colocation',
    address: '123 Street',
  };

  const mockSavedColocation: Colocation = {
    id: 1,
    title: 'My Colocation',
    address: '123 Street',
    backgroundImage: '',
    members: [mockUser],
    invitationCodes: [],
    pendingMembers: [],
    dates: {
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  };

  beforeEach(async () => {
    const mockColocationRepository = {
      save: jest.fn(),
    };

    const mockUserRepository = {
      getById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateColocationUseCase,
        {
          provide: ColocationRepositoryToken,
          useValue: mockColocationRepository,
        },
        {
          provide: UserRepositoryToken,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateColocationUseCase>(CreateColocationUseCase);
    colocationRepository = module.get(ColocationRepositoryToken);
    userRepository = module.get(UserRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create and save a colocation successfully', async () => {
      // Arrange
      userRepository.getById.mockResolvedValue(mockUser);
      colocationRepository.save.mockResolvedValue(mockSavedColocation);
      // Spy on fromEntity static method
      const fromEntitySpy = jest.spyOn(ColocationDto, 'fromEntity').mockReturnValue({
        id: mockSavedColocation.id,
        title: mockSavedColocation.title,
        address: mockSavedColocation.address,
        backgroundImage: mockSavedColocation.backgroundImage,
        members: mockSavedColocation.members,
        pendingMembers: mockSavedColocation.pendingMembers,
      });

      // Act
      const result = await useCase.execute(mockCreateColocationDto, { id: 123 });

      // Assert
      expect(userRepository.getById).toHaveBeenCalledWith(123);
      expect(userRepository.getById).toHaveBeenCalledTimes(1);

      expect(colocationRepository.save).toHaveBeenCalledTimes(1);
      const savedArg = colocationRepository.save.mock.calls[0][0];
      expect(savedArg.title).toBe(mockCreateColocationDto.title);
      expect(savedArg.address).toBe(mockCreateColocationDto.address);
      expect(savedArg.members).toContain(mockUser);

      expect(fromEntitySpy).toHaveBeenCalledWith(mockSavedColocation);

      expect(result).toEqual({
        id: mockSavedColocation.id,
        title: mockSavedColocation.title,
        address: mockSavedColocation.address,
        backgroundImage: mockSavedColocation.backgroundImage,
        members: mockSavedColocation.members,
        pendingMembers: mockSavedColocation.pendingMembers,
      });
    });

    it('should throw error if userRepository.getById fails', async () => {
      // Arrange
      const error = new Error('User not found');
      userRepository.getById.mockRejectedValue(error);

      // Act & Assert
      await expect(useCase.execute(mockCreateColocationDto, { id: 123 })).rejects.toThrow(
        'User not found'
      );

      expect(userRepository.getById).toHaveBeenCalledWith(123);
      expect(colocationRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error if colocationRepository.save fails', async () => {
      // Arrange
      userRepository.getById.mockResolvedValue(mockUser);
      const error = new Error('Save failed');
      colocationRepository.save.mockRejectedValue(error);

      // Act & Assert
      await expect(useCase.execute(mockCreateColocationDto, { id: 123 })).rejects.toThrow(
        'Save failed'
      );

      expect(userRepository.getById).toHaveBeenCalledWith(123);
      expect(colocationRepository.save).toHaveBeenCalled();
    });
  });
});
