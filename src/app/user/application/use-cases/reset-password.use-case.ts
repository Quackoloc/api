import { Inject, Injectable } from '@nestjs/common';
import {
  UserRepositoryGateway,
  UserRepositoryToken,
} from '../../domain/gateways/user.repository.gateway';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { logger } from '../../../../config/logger.config';
import { ConnectedUser } from '../../../../common/types/connected-user.type';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepositoryGateway
  ) {}

  async execute(resetPasswordDto: ResetPasswordDto, connectedUser: ConnectedUser): Promise<void> {
    const user = await this.userRepository.getById(connectedUser.id);

    user.password = await user.generatePasswordHash(resetPasswordDto.newPassword);

    await this.userRepository.save(user);

    logger.log(`Password reset for user with id: ${connectedUser.id}`, 'ResetPasswordUseCase');
  }
}
