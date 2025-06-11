import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from '@nestjs/class-validator';

export class JoinColocationDto {
  @ApiProperty({ example: '23KJD' })
  @IsString()
  @IsNotEmpty()
  @Length(5, 5)
  invitationCode: string;
}
