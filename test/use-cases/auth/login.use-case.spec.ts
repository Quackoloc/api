import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from '../../../src/app/auth/application/use-cases/login.use-case';
import {
  UserRepositoryGateway,
  UserRepositoryToken,
} from '../../../src/app/user/domain/gateways/user.repository.gateway';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../../src/app/user/domain/entities/user.entity';
import { UserDto } from '../../../src/app/user/application/dtos/user.dto';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
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
    const mockUserRepository = {
      getOneByEmail: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: UserRepositoryToken,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
    userRepository = module.get(UserRepositoryToken);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return tokens if user is found', async () => {
      // Arrange
      userRepository.getOneByEmail.mockResolvedValue(mockUser);
      configService.get.mockImplementation((key: string) =>
        key === 'JWT_ACCESS_TOKEN_EXPIRES' ? '1h' : '7d'
      );
      jwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      const fromEntitySpy = jest.spyOn(UserDto, 'fromEntity').mockReturnValue({ id: 123 } as any);

      // Act
      const result = await useCase.execute(mockUser.email);

      // Assert
      expect(userRepository.getOneByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(configService.get).toHaveBeenCalledWith('JWT_ACCESS_TOKEN_EXPIRES');
      expect(configService.get).toHaveBeenCalledWith('JWT_REFRESH_TOKEN_EXPIRES');
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(fromEntitySpy).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should throw error if user not found', async () => {
      // Arrange
      const error = new Error('User not found');
      userRepository.getOneByEmail.mockRejectedValue(error);

      // Act & Assert
      await expect(useCase.execute('unknown@example.com')).rejects.toThrow('User not found');
      expect(userRepository.getOneByEmail).toHaveBeenCalledWith('unknown@example.com');
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});
