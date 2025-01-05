import { describe } from 'node:test';
import { AuthController } from './auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceGateway } from '../gateways/auth.service.gateway';
import { AuthServiceStub } from '../services/auth.service.stub';
import { UserCannotBeCreatedException } from '../../users/exceptions/user-exception';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthServiceGateway,
          useClass: AuthServiceStub,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should return a user', async () => {
      //Given
      const user: CreateUserDto = {
        email: 'jane@smith.fr',
        firstname: 'Jane',
        lastname: 'Smith',
      };

      //When
      const result = await authController.register(user);

      //Then
      expect(result).toEqual({
        id: expect.any(Number),
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      });
    });

    it('should throw an error', async () => {
      //Given
      const user: CreateUserDto = {
        email: 'john@doe.fr',
        firstname: 'John',
        lastname: 'Doe',
      };

      //When
      const result = () => authController.register(user);

      //Then
      await expect(result).rejects.toThrow(UserCannotBeCreatedException);
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens ', async () => {
      //Given
      const credentials = {
        email: 'john@doe.fr',
        password: 'password',
      };

      //When
      const result = await authController.login(credentials);

      //Then
      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
    });
  });

  describe('refresh', () => {
    it('should return access token', async () => {
      //Given
      const refreshToken: RefreshTokenDto = { refreshToken: 'refreshToken' };

      //When
      const result = await authController.refreshToken(refreshToken);

      //Then
      expect(result).toEqual({
        accessToken: 'accessToken',
      });
    });
  });
});
