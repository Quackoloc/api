import { Inject, Injectable } from '@nestjs/common';
import {
  ColocationRepositoryGateway,
  ColocationRepositoryToken,
} from '../../domain/gateways/colocation.repository.gateway';
import {
  UserRepositoryGateway,
  UserRepositoryToken,
} from '../../../user/domain/gateways/user.repository.gateway';
import { ColocationCodeServiceGateway } from '../../domain/gateways/colocation-code.service.gateway';
import { UserIsAlreadyMemberOfColocationException } from '../../domain/colocation.exceptions';
import { logger } from '../../../../common/logger';

@Injectable()
export class JoinColocationUseCase {
  constructor(
    @Inject(ColocationRepositoryToken)
    private readonly colocationRepository: ColocationRepositoryGateway,
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepositoryGateway,
    private readonly colocationCodeService: ColocationCodeServiceGateway
  ) {}

  async execute(userId: number, code: string): Promise<void> {
    const colocationId = await this.colocationCodeService.checkIfBelongsToColocation(code);

    const colocation = await this.colocationRepository.getById(colocationId, {
      invitationCodes: true,
    });

    const user = await this.userRepository.getById(userId);

    if (colocation.members.find((member) => member.id === userId)) {
      throw new UserIsAlreadyMemberOfColocationException(userId);
    }

    colocation.members.push(user);

    logger.info(`User with id : ${userId} joined colocation with id : ${colocationId}`);

    await this.colocationRepository.save(colocation);
  }
}
