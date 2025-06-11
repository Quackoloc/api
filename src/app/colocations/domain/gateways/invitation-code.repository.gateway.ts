import { InvitationCode } from '../entities/invitation-code.entity';
import { Nullable } from '../../../../common/types/nullable.type';

export interface InvitationCodeRepositoryGateway {
  save(invitationCode: InvitationCode): Promise<InvitationCode>;

  findOneByCode(code: string): Promise<Nullable<InvitationCode>>;

  getOneByCode(code: string): Promise<InvitationCode>;
}
