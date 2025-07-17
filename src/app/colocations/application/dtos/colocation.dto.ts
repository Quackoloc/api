import { Colocation } from '../../domain/entities/colocation.entity';
import { UserDto } from '../../../user/application/dtos/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PendingUserDto } from '../../../user/application/dtos/pending-user.dto';

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

  @ApiProperty({ example: 6 })
  tasksRotationFrequency: number;

  @ApiProperty({ example: new Date('2023-05-01T00:00:00.000Z') })
  nextRotationDate: Date;

  static fromEntity(entity: Colocation): ColocationDto {
    const membres = entity.members.map((member) => UserDto.fromEntity(member));
    return {
      id: entity.id,
      title: entity.title,
      address: entity.address,
      backgroundImage: entity.backgroundImage,
      members: membres,
      pendingMembers: [],
      tasksRotationFrequency: entity.tasksRotationFrequency,
      nextRotationDate: entity.nextRotationDate,
    };
  }
}
