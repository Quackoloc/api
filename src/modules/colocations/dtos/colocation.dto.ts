import { Colocation } from '../entities/colocation.entity';
import { UserDto } from '../../users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ColocationDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 'Résidence Mozart' })
  title: string;

  @ApiProperty({ example: "2 place de l'Europe" })
  address: string;

  @ApiProperty({ example: ['flemme de faire un exemple'] })
  members: UserDto[];

  @ApiProperty({ example: 2 })
  ownerId: number;

  static fromEntity(entity: Colocation): ColocationDto {
    const members = entity.userColocations.map((m) => UserDto.fromEntity(m.user));
    const ownerId = entity.userColocations.find((m) => m.role === 'owner').user.id;

    return {
      id: entity.id,
      title: entity.title,
      address: entity.address,
      members,
      ownerId,
    };
  }
}
