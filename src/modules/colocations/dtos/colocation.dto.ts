import { Colocation } from '../entities/colocation.entity';
import { UserDto } from '../../users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PendingUserDto } from '../../users/dto/pending-user.dto';

export class ColocationDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 'Résidence Mozart' })
  title: string;

  @ApiProperty({ example: "2 place de l'Europe" })
  address: string;

  @ApiProperty({ example: ['flemme de faire un exemple'] })
  members: UserDto[];

  @ApiProperty({ example: ['flemme de faire un exemple'] })
  pendingMembers: PendingUserDto[];

  @ApiProperty({ example: ['flemme de faire un exemple'] })
  static fromEntity(entity: Colocation): ColocationDto {
    return {
      id: entity.id,
      title: entity.title,
      address: entity.address,
      members: entity.members.map((member) => UserDto.fromEntity(member)),
      pendingMembers: entity.pendingMembers.map((pendingMember) => pendingMember),
    };
  }
}
