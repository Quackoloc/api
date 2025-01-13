import { TokensDto } from '../dtos/tokens.dto';
import { AccessTokenDto } from '../dtos/access-token.dto';
import { UserDto } from '../../users/dto/user.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export abstract class AuthServiceGateway {
  abstract validateUser(email: string, password: string): Promise<UserDto>;

  abstract login(email: string): Promise<TokensDto>;

  abstract register(createUserDto: CreateUserDto): Promise<UserDto>;

  abstract refresh(refreshToken: string): Promise<AccessTokenDto>;
}
