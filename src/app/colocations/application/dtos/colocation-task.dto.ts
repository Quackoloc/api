import { ApiProperty } from '@nestjs/swagger';
import { ColocationTaskPriority } from '../../domain/enums/colocation-task-priority.enum';
import { ColocationTaskStatus } from '../../domain/enums/colocation-task-status.enum';

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
  dueDate: Date;

  @ApiProperty({ example: ColocationTaskPriority.MEDIUM })
  priority: string;

  @ApiProperty({ example: 1 })
  colocationId: number;

  @ApiProperty({ example: 1 })
  assignedToId: number;

  constructor(colocationTask: Partial<ColocationTaskDto>) {
    Object.assign(this, colocationTask);
  }

  static fromEntity(entity: ColocationTaskDto): ColocationTaskDto {
    return {
      id: entity.id,
      status: entity.status,
      title: entity.title,
      description: entity.description,
      dueDate: entity.dueDate,
      priority: entity.priority,
      colocationId: entity.colocationId,
      assignedToId: entity.assignedToId,
    };
  }
}
