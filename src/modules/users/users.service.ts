import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { PendingUser } from './entities/pending-user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PendingUser)
    private readonly pendingUserRepository: Repository<PendingUser>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const user = new User();
      user.email = createUserDto.email;
      user.firstname = createUserDto.firstname;
      user.lastname = createUserDto.lastname;
      user.password = createUserDto.password;
      user.avatar = '';

      const createdUser = await this.userRepository.save(user);

      return UserDto.fromEntity(createdUser);
    } catch (err) {}
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByEmails(emails: string[]): Promise<User[]> {
    return this.userRepository.find({
      where: {
        email: In(emails),
      },
    });
  }

  async getOneById(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    return UserDto.fromEntity(user);
  }

  findOneById(id: number, relations?: any): Promise<User> {
    return this.userRepository.findOne({ where: { id }, relations });
  }
}
