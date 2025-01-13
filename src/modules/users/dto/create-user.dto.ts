import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john@doe.fr' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString({ message: 'Firstname must be a string' })
  @IsNotEmpty({ message: 'Firstname is required' })
  @MinLength(2, { message: 'Firstname must be at least 2 characters long' })
  @MaxLength(50, { message: 'Firstname must be less than 50 characters long' })
  firstname: string;

  @ApiProperty({ example: 'Doe' })
  @IsString({ message: 'Lastname must be a string' })
  @IsNotEmpty({ message: 'Lastname is required' })
  @MinLength(2, { message: 'Lastname must be at least 2 characters long' })
  @MaxLength(50, { message: 'Lastname must be less than 50 characters long' })
  lastname: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must be less than 20 characters long' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one digit' })
  @Matches(/(?=.*[@$!%*?&])/, {
    message: 'Password must contain at least one special character (@, $, !, %, *, ?, &)',
  })
  password: string;
}
