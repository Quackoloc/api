import { Test, TestingModule } from '@nestjs/testing';
import { GetColocationsUseCase } from '../../../src/app/colocations/application/use-cases/get-colocations.use-case';
import {
  ColocationRepositoryGateway,
  ColocationRepositoryToken,
} from '../../../src/app/colocations/domain/gateways/colocation.repository.gateway';
import { ConnectedUser } from '../../../src/common/types/connected-user.type';
import { ColocationDto } from '../../../src/app/colocations/application/dtos/colocation.dto';

describe('GetColocationsUseCase', () => {
  let useCase: GetColocationsUseCase;
  let colocationRepository: jest.Mocked<ColocationRepositoryGateway>;

  const mockConnectedUser: ConnectedUser = { id: 123 };

  const mockColocationEntity = {
    id: 1,
    title: 'Test Colocation',
    address: '123 Test St',
    backgroundImage: '',
    members: [],
    invitationCodes: [],
    pendingMembers: [],
    dates: {
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  };

  const mockColocationDto = {
    id: mockColocationEntity.id,
    title: mockColocationEntity.title,
    address: mockColocationEntity.address,
    backgroundImage: mockColocationEntity.backgroundImage,
    members: mockColocationEntity.members,
    invitationCodes: mockColocationEntity.invitationCodes,
    pendingMembers: mockColocationEntity.pendingMembers,
    dates: mockColocationEntity.dates,
  };

  beforeEach(async () => {
    const mockRepository = {
      findMemberColocations: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetColocationsUseCase,
        {
          provide: ColocationRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetColocationsUseCase>(GetColocationsUseCase);
    colocationRepository = module.get(ColocationRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the first colocation dto from the repository', async () => {
    // Mock la méthode fromEntity statique
    jest.spyOn(ColocationDto, 'fromEntity').mockReturnValue(mockColocationDto);

    // Le repository retourne une liste avec un seul colocation
    colocationRepository.findMemberColocations.mockResolvedValue([mockColocationEntity]);

    const result = await useCase.execute(mockConnectedUser);

    expect(colocationRepository.findMemberColocations).toHaveBeenCalledWith(mockConnectedUser.id);
    expect(ColocationDto.fromEntity).toHaveBeenCalledWith(mockColocationEntity);
    expect(result).toEqual(mockColocationDto);
  });

  it('should return undefined if no colocations found', async () => {
    jest.spyOn(ColocationDto, 'fromEntity');

    colocationRepository.findMemberColocations.mockResolvedValue([]);

    const result = await useCase.execute(mockConnectedUser);

    expect(colocationRepository.findMemberColocations).toHaveBeenCalledWith(mockConnectedUser.id);
    expect(ColocationDto.fromEntity).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should propagate errors thrown by the repository', async () => {
    const error = new Error('Database error');
    colocationRepository.findMemberColocations.mockRejectedValue(error);

    await expect(useCase.execute(mockConnectedUser)).rejects.toThrow(error);

    expect(colocationRepository.findMemberColocations).toHaveBeenCalledWith(mockConnectedUser.id);
  });
});
