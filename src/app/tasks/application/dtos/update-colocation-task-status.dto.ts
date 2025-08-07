import { ColocationTaskStatus } from '../../domain/enums/colocation-task-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateColocationTaskStatusDto {
  @IsEnum(ColocationTaskStatus)
  status: ColocationTaskStatus;
}
