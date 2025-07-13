import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { ValidateUserUseCase } from '../../application/use-cases/validate-user.use-case';
import { UserDto } from '../../../user/application/dtos/user.dto';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let validateUserUseCase: jest.Mocked<ValidateUserUseCase>;

  const mockUserDto = new UserDto({
    id: 1,
    email: 'test@example.com',
    firstname: 'Test',
    lastname: 'User',
    avatar: '',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: ValidateUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get(LocalStrategy);
    validateUserUseCase = module.get(ValidateUserUseCase);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate and return user DTO', async () => {
    validateUserUseCase.execute.mockResolvedValue(mockUserDto);

    const result = await strategy.validate('test@example.com', 'password');

    expect(validateUserUseCase.execute).toHaveBeenCalledWith('test@example.com', 'password');
    expect(result).toEqual(mockUserDto);
  });
});
