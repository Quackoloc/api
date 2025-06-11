import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class CreateInvitationCodeDto {
  @IsDateString()
  @ApiProperty({ example: '2023-05-01T00:00:00.000Z' })
  expiresAt: Date;
}
