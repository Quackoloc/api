import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '../../../src/app/user/application/use-cases/create-user.use-case';
import {
  UserRepositoryGateway,
  UserRepositoryToken,
} from '../../../src/app/user/domain/gateways/user.repository.gateway';
import { User } from '../../../src/app/user/domain/entities/user.entity';
import { CreateUserDto } from '../../../src/app/user/application/dtos/create-user.dto';
import { UserEmailAlreadyExistsException } from '../../../src/app/user/domain/user-exceptions';
import { UserDto } from '../../../src/app/user/application/dtos/user.dto';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepositoryGateway>;

  const createUserDto: CreateUserDto = {
    email: 'new@example.com',
    firstname: 'Jane',
    lastname: 'Doe',
    password: 'hashedPass',
  };

  const mockSavedUser = new User();
  mockSavedUser.id = 1;
  mockSavedUser.email = createUserDto.email;
  mockSavedUser.avatar = '';
  mockSavedUser.lastname = createUserDto.lastname;
  mockSavedUser.firstname = createUserDto.firstname;
  mockSavedUser.password = createUserDto.password;
  mockSavedUser.colocation = null;
  mockSavedUser.dates = {
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: UserRepositoryToken,
          useValue: {
            findOneByEmail: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(CreateUserUseCase);
    userRepository = module.get(UserRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user if email is not taken', async () => {
    userRepository.findOneByEmail.mockResolvedValue(null);
    userRepository.save.mockResolvedValue(mockSavedUser);
    const fromEntitySpy = jest.spyOn(UserDto, 'fromEntity').mockReturnValue({
      id: mockSavedUser.id,
      email: mockSavedUser.email,
      firstname: mockSavedUser.firstname,
      lastname: mockSavedUser.lastname,
      avatar: '',
    });

    const result = await useCase.execute(createUserDto);

    expect(userRepository.findOneByEmail).toHaveBeenCalledWith(createUserDto.email);
    expect(userRepository.save).toHaveBeenCalled();
    expect(result).toEqual({
      id: 1,
      email: createUserDto.email,
      firstname: createUserDto.firstname,
      lastname: createUserDto.lastname,
      avatar: '',
    });

    expect(fromEntitySpy).toHaveBeenCalledWith(mockSavedUser);
  });

  it('should throw if email already exists', async () => {
    userRepository.findOneByEmail.mockResolvedValue(mockSavedUser);

    await expect(useCase.execute(createUserDto)).rejects.toThrow(
      new UserEmailAlreadyExistsException(createUserDto.email)
    );

    expect(userRepository.findOneByEmail).toHaveBeenCalledWith(createUserDto.email);
    expect(userRepository.save).not.toHaveBeenCalled();
  });
});
