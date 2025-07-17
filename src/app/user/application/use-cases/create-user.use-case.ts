import { Inject, Injectable } from '@nestjs/common';
import {
  UserRepositoryGateway,
  UserRepositoryToken,
} from '../../domain/gateways/user.repository.gateway';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserDto } from '../dtos/user.dto';
import { User } from '../../domain/entities/user.entity';
import { UserEmailAlreadyExistsException } from '../../domain/user-exceptions';
import { logger } from '../../../../config/logger.config';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepositoryGateway
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<UserDto> {
    await this.checkEmailAlreadyExists(createUserDto.email);

    const user = new User();
    user.email = createUserDto.email;
    user.firstname = createUserDto.firstname;
    user.lastname = createUserDto.lastname;
    user.password = createUserDto.password;
    user.avatar = '';

    const createdUser = await this.userRepository.save(user);

    logger.log(`User with id : ${user.id} created`, 'CreateUserUseCase');

    return UserDto.fromEntity(createdUser);
  }

  private async checkEmailAlreadyExists(email: string) {
    const existingUser = await this.userRepository.findOneByEmail(email);

    if (existingUser) {
      throw new UserEmailAlreadyExistsException(email);
    }
  }
}
