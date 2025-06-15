import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from '@nestjs/class-validator';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';
import { ColocationTaskPriority } from '../../domain/enums/colocation-task-priority.enum';

export class UpdateColocationTaskDto {
  @ApiProperty({ example: 'Faire la vaisselle' })
  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  @Length(2, 100, { message: 'Title must be between 2 and 100 characters long' })
  title: string;

  @ApiProperty({ example: 'Tout mettre dans le lave vaisselle' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(2, 1000, { message: 'Description must be between 2 and 1000 characters long' })
  description: string;

  @ApiProperty({ example: '2023-03-01' })
  @IsDateString()
  @IsOptional()
  dueDate: Date;

  @ApiProperty({ example: ColocationTaskPriority.MEDIUM })
  @IsOptional()
  priority: ColocationTaskPriority;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  assignToId: number;
}
