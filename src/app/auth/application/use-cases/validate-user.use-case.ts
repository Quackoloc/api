import { Inject, Injectable } from '@nestjs/common';
import {
  UserRepositoryGateway,
  UserRepositoryToken,
} from '../../../user/domain/gateways/user.repository.gateway';
import { compareSync } from 'bcryptjs';
import { UserDto } from '../../../user/application/dtos/user.dto';

@Injectable()
export class ValidateUserUseCase {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepositoryGateway
  ) {}

  async execute(email: string, password: string): Promise<UserDto> {
    const user = await this.userRepository.getOneByEmail(email);

    return compareSync(password, user?.password) ? UserDto.fromEntity(user) : null;
  }
}
