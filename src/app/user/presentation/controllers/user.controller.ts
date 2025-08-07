import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from '../../application/dtos/user.dto';
import { GetConnectedUser } from '../../../../common/decorators/get-connected-user.decorator';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  @Get('@me')
  async me(@GetConnectedUser() connectedUser: ConnectedUser): Promise<UserDto> {
    return this.getUserUseCase.execute(connectedUser.id);
  }
}
