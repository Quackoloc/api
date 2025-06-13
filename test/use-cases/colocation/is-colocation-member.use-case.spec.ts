import { Test, TestingModule } from '@nestjs/testing';
import {
  ColocationRepositoryGateway,
  ColocationRepositoryToken,
} from '../../../src/app/colocations/domain/gateways/colocation.repository.gateway';
import { IsColocationMemberUseCase } from '../../../src/app/colocations/application/use-cases/is-colocation-member.use-case';
import { User } from '../../../src/app/user/domain/entities/user.entity';
import { Colocation } from '../../../src/app/colocations/domain/entities/colocation.entity';

describe('IsColocationMemberUseCase', () => {
  let useCase: IsColocationMemberUseCase;
  let colocationRepository: jest.Mocked<ColocationRepositoryGateway>;

  const colocationId = 1;
  const userId = 123;

  const mockUser = { id: userId } as User;
  const mockColocation = new Colocation();
  mockColocation.members = [mockUser];

  beforeEach(async () => {
    const mockColocationRepository = {
      getById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsColocationMemberUseCase,
        { provide: ColocationRepositoryToken, useValue: mockColocationRepository },
      ],
    }).compile();

    useCase = module.get<IsColocationMemberUseCase>(IsColocationMemberUseCase);
    colocationRepository = module.get(ColocationRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if user is a member of the colocation', async () => {
    colocationRepository.getById.mockResolvedValue(mockColocation);

    const result = await useCase.execute(userId, colocationId);

    expect(colocationRepository.getById).toHaveBeenCalledWith(colocationId, { members: true });
    expect(result).toBe(true);
  });

  it('should return false if user is not a member of the colocation', async () => {
    colocationRepository.getById.mockResolvedValue({
      id: colocationId,
      members: [{ id: 999 } as User],
    } as Colocation);

    const result = await useCase.execute(userId, colocationId);

    expect(result).toBe(false);
  });

  it('should propagate errors from colocationRepository.getById', async () => {
    const error = new Error('Database error');
    colocationRepository.getById.mockRejectedValue(error);

    await expect(useCase.execute(userId, colocationId)).rejects.toThrow(error);
  });
});
