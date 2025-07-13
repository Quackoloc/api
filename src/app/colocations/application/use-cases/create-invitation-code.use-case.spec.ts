import { Test, TestingModule } from '@nestjs/testing';
import { InvitationCodeRepositoryGateway } from '../../domain/gateways/invitation-code.repository.gateway';
import { CreateInvitationCodeUseCase } from './create-invitation-code.use-case';
import { ColocationCodeServiceGateway } from '../../domain/gateways/colocation-code.service.gateway';
import { InvitationCodeRepositoryToken } from '../../infrastructure/repositories/invitation-code.repository';

describe('CreateInvitationCodeUseCase', () => {
  let useCase: CreateInvitationCodeUseCase;
  let invitationCodeRepository: jest.Mocked<InvitationCodeRepositoryGateway>;
  let colocationCodeService: jest.Mocked<ColocationCodeServiceGateway>;

  beforeEach(async () => {
    const mockInvitationCodeRepository = {
      save: jest.fn(),
    };

    const mockColocationCodeService = {
      createCode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateInvitationCodeUseCase,
        {
          provide: InvitationCodeRepositoryToken,
          useValue: mockInvitationCodeRepository,
        },
        {
          provide: ColocationCodeServiceGateway,
          useValue: mockColocationCodeService,
        },
      ],
    }).compile();

    useCase = module.get<CreateInvitationCodeUseCase>(CreateInvitationCodeUseCase);
    invitationCodeRepository = module.get(InvitationCodeRepositoryToken);
    colocationCodeService = module.get(ColocationCodeServiceGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip('should create and save an invitation code, then return the DTO', async () => {
    // TODO: fix this test
  });

  it('should propagate errors if createCode fails', async () => {
    const colocationId = 42;
    const expiresAt = new Date();
    const connectedUser = { id: 123 };

    colocationCodeService.createCode.mockRejectedValue(new Error('Failed to generate code'));

    await expect(useCase.execute(colocationId, expiresAt, connectedUser)).rejects.toThrow(
      'Failed to generate code'
    );
    expect(invitationCodeRepository.save).not.toHaveBeenCalled();
  });

  it('should propagate errors if save fails', async () => {
    const colocationId = 42;
    const expiresAt = new Date();
    const generatedCode = 'XYZ789';
    const connectedUser = { id: 123 };

    colocationCodeService.createCode.mockResolvedValue(generatedCode);
    invitationCodeRepository.save.mockRejectedValue(new Error('Save error'));

    await expect(useCase.execute(colocationId, expiresAt, connectedUser)).rejects.toThrow(
      'Save error'
    );
  });
});
