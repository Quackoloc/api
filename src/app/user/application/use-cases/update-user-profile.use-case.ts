import { Inject, Injectable } from '@nestjs/common';
import {
  UserRepositoryGateway,
  UserRepositoryToken,
} from '../../domain/gateways/user.repository.gateway';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import { logger } from '../../../../config/logger.config';
import { UserEmailAlreadyExistsException } from '../../domain/user-exceptions';

@Injectable()
export class UpdateUserProfileUseCase {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepositoryGateway
  ) {}

  async execute(dto: UpdateUserDto, connectedUser: ConnectedUser): Promise<void> {
    const userToUpdate = await this.userRepository.getById(connectedUser.id);
    let isUpdated = false;

    if (dto.email !== undefined && dto.email !== userToUpdate.email) {
      const existingUser = await this.userRepository.findOneByEmail(dto.email);
      if (existingUser && existingUser.id !== connectedUser.id) {
        throw new UserEmailAlreadyExistsException(dto.email);
      }

      userToUpdate.email = dto.email;
      isUpdated = true;
    }

    if (dto.firstname !== undefined && dto.firstname !== userToUpdate.firstname) {
      userToUpdate.firstname = dto.firstname;
      isUpdated = true;
    }

    if (dto.lastname !== undefined && dto.lastname !== userToUpdate.lastname) {
      userToUpdate.lastname = dto.lastname;
      isUpdated = true;
    }

    if (isUpdated) {
      await this.userRepository.save(userToUpdate);
      logger.log(
        `User with id: ${userToUpdate.id} updated by user with ID: ${connectedUser.id}`,
        'UpdateUserProfileUseCase'
      );
    }
  }
}
