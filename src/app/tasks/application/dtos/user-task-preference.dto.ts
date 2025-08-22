import { UserTaskPreference } from '../../domain/entities/user-task-preference.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserTaskPreferenceDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: true })
  isOptedIn: boolean;

  @ApiProperty({ example: 12 })
  userId: number;

  @ApiProperty({ example: 23 })
  taskId: number;

  constructor(userTaskPreference: UserTaskPreference) {
    Object.assign(this, userTaskPreference);
  }

  static fromEntity(entity: UserTaskPreference): UserTaskPreferenceDto {
    return {
      id: entity.id,
      isOptedIn: entity.isOptedIn,
      userId: entity.userId,
      taskId: entity.taskId,
    };
  }
}
