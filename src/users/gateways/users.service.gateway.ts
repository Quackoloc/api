import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';

export abstract class UsersServiceGateway {
  abstract create(createUserDto: CreateUserDto): Promise<UserDto>;

  abstract findOneById(id: number): Promise<User>;

  abstract getOneById(id: number): Promise<UserDto>;

  abstract findOneByEmail(email: string): Promise<User>;
}
