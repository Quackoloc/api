import { Test, TestingModule } from '@nestjs/testing';
import { RefreshAccessTokenUseCase } from '../../../src/app/auth/application/use-cases/refresh-access-token.use-case';
import {
  UserRepositoryGateway,
  UserRepositoryToken,
} from '../../../src/app/user/domain/gateways/user.repository.gateway';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../../src/app/user/domain/entities/user.entity';
import { UserIdNotFoundException } from '../../../src/app/user/domain/user-exceptions';

describe('RefreshAccessTokenUseCase', () => {
  let useCase: RefreshAccessTokenUseCase;
  let userRepository: jest.Mocked<UserRepositoryGateway>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshAccessTokenUseCase,
        {
          provide: UserRepositoryToken,
          useValue: { getById: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { verify: jest.fn(), sign: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get(RefreshAccessTokenUseCase);
    userRepository = module.get(UserRepositoryToken);
    configService = module.get(ConfigService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return a new access token', async () => {
      const refreshToken = 'valid.refresh.token';
      const payload = { sub: mockUser.id };
      const accessToken = 'new.access.token';

      jwtService.verify.mockReturnValue(payload);
      userRepository.getById.mockResolvedValue(mockUser);
      configService.get.mockReturnValue('15m'); // mock expires config
      jwtService.sign.mockReturnValue(accessToken);

      const result = await useCase.execute(refreshToken);

      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: '15m',
      });

      expect(userRepository.getById).toHaveBeenCalledWith(mockUser.id);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id }, { expiresIn: '15m' });
      expect(result).toEqual({ accessToken });
    });

    it('should throw if user not found', async () => {
      jwtService.verify.mockReturnValue({ sub: 42 });
      userRepository.getById.mockResolvedValue(null);

      await expect(useCase.execute('token')).rejects.toThrow(UserIdNotFoundException);
    });

    it('should propagate jwtService.verify error', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(useCase.execute('invalid.token')).rejects.toThrow('Invalid token');
    });
  });
});
