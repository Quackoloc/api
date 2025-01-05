import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from '@nestjs/class-validator';
import { User } from '../entities/user.entity';

export class UserDto {
  @IsInt({ message: 'ID must be an integer' })
  @Min(1, { message: 'ID must be a positive number' })
  id: number;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString({ message: 'Firstname must be a string' })
  @IsNotEmpty({ message: 'Firstname is required' })
  @MaxLength(50, { message: 'Firstname must be less than 50 characters long' })
  firstname: string;

  @IsString({ message: 'Lastname must be a string' })
  @IsNotEmpty({ message: 'Lastname is required' })
  @MaxLength(50, { message: 'Lastname must be less than 50 characters long' })
  lastname: string;

  static fromEntity(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    };
  }
}
