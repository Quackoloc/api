import { Colocation } from '../entities/colocation.entity';
import { UserDto } from '../../users/dto/user.dto';

export class ColocationDto {
  id: number;
  title: string;
  address: string;
  members: UserDto[];
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
