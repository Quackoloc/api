import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from '../../application/dtos/user.dto';
import { GetConnectedUser } from '../../../../common/decorators/get-connected-user.decorator';
import { UsersService } from '../../users.service';
import { ConnectedUser } from '../../../../common/types/connected-user.type';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get('@me')
  async me(@GetConnectedUser() connectedUser: ConnectedUser): Promise<UserDto> {
    return this.usersService.getOneById(connectedUser.id);
  }
}
