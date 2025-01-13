import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { GetConnectedUser } from '../../common/decorators/get-connected-user.decorator';
import { ConnectedUser } from '../auth/connected-user.model';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userServiceGateway: UsersService) {}

  @Get('me')
  async me(@GetConnectedUser() connectedUser: ConnectedUser): Promise<UserDto> {
    return this.userServiceGateway.getOneById(connectedUser.id);
  }
}
