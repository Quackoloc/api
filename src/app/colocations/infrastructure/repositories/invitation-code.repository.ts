import { Repository } from 'typeorm';
import { InvitationCode } from '../../domain/entities/invitation-code.entity';
import { InvitationCodeRepositoryGateway } from '../../domain/gateways/invitation-code.repository.gateway';
import { Nullable } from 'src/common/types/nullable.type';
import { InvitationCodeNotFoundException } from '../../domain/colocation.exceptions';

export class InvitationCodeRepository
  extends Repository<InvitationCode>
  implements InvitationCodeRepositoryGateway
{
  async findOneByCode(code: string): Promise<Nullable<InvitationCode>> {
    return await this.findOne({ where: { code } });
  }

  async getOneByCode(code: string): Promise<InvitationCode> {
    const entity = await this.findOneByCode(code);

    if (!entity) {
      throw new InvitationCodeNotFoundException(code);
    }

    return entity;
  }
}

export const InvitationCodeRepositoryToken = 'InvitationCodeRepositoryToken';
