import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersServiceGateway } from '../gateways/users.service.gateway';
import { UserDto } from '../dto/user.dto';
import { GetConnectedUser } from '../../auth/guards/get-connected-user.decorator';
import { ConnectedUser } from '../../auth/connected-user.model';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userServiceGateway: UsersServiceGateway) {}

  @Get('me')
  async me(@GetConnectedUser() connectedUser: ConnectedUser): Promise<UserDto> {
    return this.userServiceGateway.getOneById(connectedUser.id);
  }
}
