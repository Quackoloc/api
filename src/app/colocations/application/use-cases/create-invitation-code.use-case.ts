import { Inject, Injectable } from '@nestjs/common';
import { ColocationCodeServiceGateway } from '../../domain/gateways/colocation-code.service.gateway';
import { InvitationCode } from '../../domain/entities/invitation-code.entity';
import { InvitationCodeRepositoryToken } from '../../infrastructure/repositories/invitation-code.repository';
import { InvitationCodeRepositoryGateway } from '../../domain/gateways/invitation-code.repository.gateway';
import { InvitationCodeDto } from '../dtos/invitation-code.dto';
import { logger } from '../../../../config/logger.config';
import { ConnectedUser } from '../../../../common/types/connected-user.type';

@Injectable()
export class CreateInvitationCodeUseCase {
  constructor(
    @Inject(InvitationCodeRepositoryToken)
    private readonly invitationCodeRepository: InvitationCodeRepositoryGateway,
    private readonly colocationCodeService: ColocationCodeServiceGateway
  ) {}

  async execute(
    colocationId: number,
    expiresAt: Date,
    connectedUser: ConnectedUser
  ): Promise<InvitationCodeDto> {
    const code = await this.colocationCodeService.createCode();

    const invitationCode = new InvitationCode();
    invitationCode.code = code;
    invitationCode.expiresAt = expiresAt;
    invitationCode.colocationId = colocationId;

    const createdCode = await this.invitationCodeRepository.save(invitationCode);

    logger.log(
      `Colocation invitation code with id : ${createdCode.id} created by user with id : ${connectedUser.id}`
    );

    return InvitationCodeDto.fromEntity(createdCode);
  }
}
