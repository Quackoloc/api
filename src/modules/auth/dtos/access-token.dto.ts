import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiProperty({ example: 'access-token' })
  accessToken: string;
}
