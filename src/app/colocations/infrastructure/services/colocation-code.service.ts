import { Inject, Injectable } from '@nestjs/common';
import { ColocationCodeServiceGateway } from '../../domain/gateways/colocation-code.service.gateway';
import { InvitationCodeRepositoryToken } from '../repositories/invitation-code.repository';
import { InvitationCodeRepositoryGateway } from '../../domain/gateways/invitation-code.repository.gateway';
import { ColocationCodeNotFoundException } from '../../domain/colocation.exceptions';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

@Injectable()
export class ColocationCodeService implements ColocationCodeServiceGateway {
  constructor(
    @Inject(InvitationCodeRepositoryToken)
    private readonly invitationCodeRepository: InvitationCodeRepositoryGateway
  ) {}

  async createCode(): Promise<string> {
    let code = this.generateRandomCode();

    while (await this.codeExists(code)) {
      code = this.generateRandomCode();
    }

    return code;
  }

  async checkIfBelongsToColocation(code: string, colocationId: number): Promise<void> {
    const entity = await this.invitationCodeRepository.getOneByCode(code);

    if (entity.colocationId !== colocationId) {
      throw new ColocationCodeNotFoundException(code);
    }
  }

  private generateRandomCode(): string {
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
    }
    return code;
  }

  private async codeExists(code: string): Promise<boolean> {
    return !!(await this.invitationCodeRepository.findOneByCode(code));
  }
}
