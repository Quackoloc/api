import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);

      return UserDto.fromEntity(user);
    } catch (err) {}
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getOneById(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    return UserDto.fromEntity(user);
  }

  findOneById(id: number, relations?: any): Promise<User> {
    return this.userRepository.findOne({ where: { id }, relations });
  }
}
