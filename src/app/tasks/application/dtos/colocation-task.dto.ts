import { ApiProperty } from '@nestjs/swagger';
import { ColocationTaskPriority } from '../../domain/enums/colocation-task-priority.enum';
import { ColocationTaskStatus } from '../../domain/enums/colocation-task-status.enum';
import { Nullable } from '../../../../common/types/nullable.type';
import { ColocationTask } from '../../domain/entities/colocation-task.entity';
import { UserTaskPreferenceDto } from './user-task-preference.dto';

export class ColocationTaskDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 'DOING' })
  status: ColocationTaskStatus;

  @ApiProperty({ example: 'Sortir les poubelles' })
  title: string;

  @ApiProperty({ example: 'Faire les poubelles et le tri' })
  description: string;

  @ApiProperty({ example: '2023-05-01' })
  dueDate: Nullable<Date>;

  @ApiProperty({ example: ColocationTaskPriority.MEDIUM })
  priority: string;

  @ApiProperty({ example: 1 })
  colocationId: number;

  @ApiProperty({ example: 1 })
  assignedToId: number;

  @ApiProperty({ example: true })
  isRecurrent: boolean;

  @ApiProperty({ example: [UserTaskPreferenceDto] })
  userTaskPreferences: UserTaskPreferenceDto[];

  constructor(colocationTask: Partial<ColocationTaskDto>) {
    Object.assign(this, colocationTask);
  }

  static fromEntity(entity: ColocationTask): ColocationTaskDto {
    const userTaskPreferences = entity.userPreferences.map((userTaskPreference) =>
      UserTaskPreferenceDto.fromEntity(userTaskPreference)
    );

    return {
      id: entity.id,
      status: entity.status,
      title: entity.title,
      description: entity.description,
      dueDate: entity.dueDate ?? null,
      priority: entity.priority,
      colocationId: entity.colocationId,
      assignedToId: entity.assignedToId,
      isRecurrent: entity.isRecurrent,
      userTaskPreferences,
    };
  }
}
