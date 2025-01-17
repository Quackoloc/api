import { ApiProperty } from '@nestjs/swagger';
import { PendingUser } from '../entities/pending-user.entity';

export class PendingUserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john@doe.fr' })
  email: string;

  static fromEntity(user: PendingUser): PendingUserDto {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
