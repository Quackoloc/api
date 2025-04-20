import { IsNotEmpty, IsString, Length } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateColocationDto {
  @ApiProperty({ example: 'Colocation chez les amis' })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @Length(2, 100, { message: 'Title must be between 2 and 100 characters long' })
  title: string;

  //todo: faire un type d'adresse
  @ApiProperty({ example: '123 Rue de la Paix, Paris, France' })
  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  @Length(5, 255, { message: 'Address must be between 5 and 255 characters long' })
  address: string;

  // @ApiProperty({
  //   type: [String],
  //   example: ['john@doe.fr', 'jane@smith.fr'],
  //   description: 'List of emails for the members of the colocation',
  // })
  // @IsOptional()
  // @IsArray({ message: 'Members must be an array' })
  // @IsEmail({}, { each: true, message: 'Each member must be a valid email' })
  // members: string[];
}
