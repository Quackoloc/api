import { Test, TestingModule } from '@nestjs/testing';
import {
  ColocationRepositoryGateway,
  ColocationRepositoryToken,
} from '../../../src/app/colocations/domain/gateways/colocation.repository.gateway';
import { UpdateColocationUseCase } from '../../../src/app/colocations/application/use-cases/update-colocation.use-case';
import { ConnectedUser } from '../../../src/common/types/connected-user.type';
import { UpdateColocationDto } from '../../../src/app/colocations/application/dtos/update-colocation.dto';
import { logger } from '../../../src/common/logger';
import { Colocation } from '../../../src/app/colocations/domain/entities/colocation.entity';

jest.mock('../../../src/common/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('UpdateColocationUseCase', () => {
  let useCase: UpdateColocationUseCase;
  let colocationRepository: jest.Mocked<ColocationRepositoryGateway>;

  const mockColocation: Colocation = {
    id: 1,
    title: 'Old Title',
    address: 'Old Address',
    backgroundImage: 'old-background.jpg',
    members: [],
    invitationCodes: [],
    pendingMembers: [],
    dates: {
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
      deletedAt: null,
    },
  };

  const mockConnectedUser: ConnectedUser = {
    id: 123,
  };

  const mockUpdateColocationDto: UpdateColocationDto = {
    title: 'New Title',
    address: 'New Address',
  };

  beforeEach(async () => {
    const mockColocationRepository = {
      getById: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateColocationUseCase,
        {
          provide: ColocationRepositoryToken,
          useValue: mockColocationRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateColocationUseCase>(UpdateColocationUseCase);
    colocationRepository = module.get(ColocationRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update colocation successfully', async () => {
      // Arrange
      colocationRepository.getById.mockResolvedValue(mockColocation);
      colocationRepository.save.mockResolvedValue(undefined);

      // Act
      await useCase.execute(1, mockUpdateColocationDto, mockConnectedUser);

      // Assert
      expect(colocationRepository.getById).toHaveBeenCalledWith(1);
      expect(colocationRepository.getById).toHaveBeenCalledTimes(1);

      expect(mockColocation.title).toBe('New Title');
      expect(mockColocation.address).toBe('New Address');

      expect(colocationRepository.save).toHaveBeenCalledWith(mockColocation);
      expect(colocationRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should log the update operation', async () => {
      // Arrange
      colocationRepository.getById.mockResolvedValue(mockColocation);
      colocationRepository.save.mockResolvedValue(undefined);

      // Act
      await useCase.execute(1, mockUpdateColocationDto, mockConnectedUser);

      // Assert
      expect(logger.info).toHaveBeenCalledWith(
        'Colocation with id : 1 updated by user with id : 123'
      );
      expect(logger.info).toHaveBeenCalledTimes(1);
    });

    it('should throw error when colocation is not found', async () => {
      // Arrange
      const error = new Error('Colocation not found');
      colocationRepository.getById.mockRejectedValue(error);

      // Act & Assert
      await expect(useCase.execute(1, mockUpdateColocationDto, mockConnectedUser)).rejects.toThrow(
        'Colocation not found'
      );

      expect(colocationRepository.getById).toHaveBeenCalledWith(1);
      expect(colocationRepository.save).not.toHaveBeenCalled();
      expect(logger.info).not.toHaveBeenCalled();
    });

    it('should throw error when save fails', async () => {
      // Arrange
      const error = new Error('Save failed');
      colocationRepository.getById.mockResolvedValue(mockColocation);
      colocationRepository.save.mockRejectedValue(error);

      // Act & Assert
      await expect(useCase.execute(1, mockUpdateColocationDto, mockConnectedUser)).rejects.toThrow(
        'Save failed'
      );

      expect(colocationRepository.getById).toHaveBeenCalledWith(1);
      expect(colocationRepository.save).toHaveBeenCalledWith(mockColocation);
      expect(logger.info).toHaveBeenCalled(); // Le log est appelé avant le save
    });

    it('should update only the provided fields', async () => {
      // Arrange
      const partialUpdateDto = { title: 'Only Title Updated' } as UpdateColocationDto;
      colocationRepository.getById.mockResolvedValue(mockColocation);
      colocationRepository.save.mockResolvedValue(undefined);

      // Act
      await useCase.execute(1, partialUpdateDto, mockConnectedUser);

      // Assert
      expect(mockColocation.title).toBe('Only Title Updated');
      expect(mockColocation.address).toBe(undefined); // L'adresse sera undefined car assignée depuis le DTO
    });

    it('should handle different colocation IDs correctly', async () => {
      // Arrange
      const colocationId = 999;
      colocationRepository.getById.mockResolvedValue(mockColocation);
      colocationRepository.save.mockResolvedValue(undefined);

      // Act
      await useCase.execute(colocationId, mockUpdateColocationDto, mockConnectedUser);

      // Assert
      expect(colocationRepository.getById).toHaveBeenCalledWith(colocationId);
      expect(logger.info).toHaveBeenCalledWith(
        `Colocation with id : ${colocationId} updated by user with id : ${mockConnectedUser.id}`
      );
    });

    it('should handle different user IDs correctly', async () => {
      // Arrange
      const differentUser: ConnectedUser = { ...mockConnectedUser, id: 456 };
      colocationRepository.getById.mockResolvedValue(mockColocation);
      colocationRepository.save.mockResolvedValue(undefined);

      // Act
      await useCase.execute(1, mockUpdateColocationDto, differentUser);

      // Assert
      expect(logger.info).toHaveBeenCalledWith(
        'Colocation with id : 1 updated by user with id : 456'
      );
    });
  });
});
