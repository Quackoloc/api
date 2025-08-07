import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from '@nestjs/class-validator';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'john@doe.fr' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'John' })
  @IsString({ message: 'Firstname must be a string' })
  @IsNotEmpty({ message: 'Firstname is required' })
  @MinLength(2, { message: 'Firstname must be at least 2 characters long' })
  @MaxLength(50, { message: 'Firstname must be less than 50 characters long' })
  @IsOptional()
  firstname?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString({ message: 'Lastname must be a string' })
  @IsNotEmpty({ message: 'Lastname is required' })
  @MinLength(2, { message: 'Lastname must be at least 2 characters long' })
  @MaxLength(50, { message: 'Lastname must be less than 50 characters long' })
  @IsOptional()
  lastname?: string;
}
