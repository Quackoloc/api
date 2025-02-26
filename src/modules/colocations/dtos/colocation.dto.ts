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

  @ApiProperty({ example: 'https://quackoloc.fr/colocation/background.png' })
  backgroundImage: string;

  @ApiProperty({ example: [UserDto] })
  members: UserDto[];

  @ApiProperty({ example: [PendingUserDto] })
  pendingMembers: PendingUserDto[];

  static fromEntity(entity: Colocation): ColocationDto {
    console.log(entity);
    const membres = entity.members.map((member) => UserDto.fromEntity(member));
    const pendingMembers = entity.pendingMembers.map((pendingMember) =>
      PendingUserDto.fromEntity(pendingMember)
    );
    return {
      id: entity.id,
      title: entity.title,
      address: entity.address,
      backgroundImage: entity.backgroundImage,
      members: membres,
      pendingMembers: pendingMembers,
    };
  }
}
