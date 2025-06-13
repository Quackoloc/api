import { User } from '../../domain/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john@doe.fr' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstname: string;

  @ApiProperty({ example: 'Doe' })
  lastname: string;

  @ApiProperty({ example: 'https://quackoloc.com/avatar.png' })
  avatar: string;

  constructor(dto: Partial<UserDto>) {
    Object.assign(this, dto);
  }

  static fromEntity(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      avatar: user.avatar,
    };
  }
}
