import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty({ example: 'access-token' })
  accessToken: string;

  @ApiProperty({ example: 'refresh-token' })
  refreshToken: string;
}
