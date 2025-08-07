import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IsColocationMemberUseCase } from '../../app/colocations/application/use-cases/is-colocation-member.use-case';
import { UserIsNotMemberOfColocationException } from '../../app/colocations/domain/colocation.exceptions';

@Injectable()
export class ColocationMemberGuard implements CanActivate {
  constructor(private readonly isColocationMemberUseCase: IsColocationMemberUseCase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const colocationId = Number(this.extractColocationId(request));

    const isMember = await this.isColocationMemberUseCase.execute(user.id, colocationId);

    if (!isMember) {
      throw new UserIsNotMemberOfColocationException(colocationId, user.id);
    }

    return true;
  }

  private extractColocationId(request: any): string | null {
    return (
      request.params?.colocationId ||
      request.params?.id ||
      request.body?.colocationId ||
      request.query?.colocationId ||
      null
    );
  }
}
