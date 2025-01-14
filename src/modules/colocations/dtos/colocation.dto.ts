import { Colocation } from '../entities/colocation.entity';
import { UserDto } from '../../users/dto/user.dto';

export class ColocationDto {
  id: number;
  title: string;
  address: string;
  members: UserDto[];

  static fromEntity(entity: Colocation): ColocationDto {
    return {
      id: entity.id,
      title: entity.title,
      address: entity.address,
      members: entity.members.map((m) => UserDto.fromEntity(m)),
    };
  }
}
