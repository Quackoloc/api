import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from '../../application/dtos/user.dto';
import { GetConnectedUser } from '../../../../common/decorators/get-connected-user.decorator';
import { ConnectedUser } from '../../../auth/connected-user.model';
import { UsersService } from '../../users.service';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly createUserUseCase: CreateUserUseCase
  ) {}

  @Get('me')
  async me(@GetConnectedUser() connectedUser: ConnectedUser): Promise<UserDto> {
    return this.usersService.getOneById(connectedUser.id);
  }
}
