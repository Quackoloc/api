import { ApiProperty } from '@nestjs/swagger';
import { InvitationCode } from '../../domain/entities/invitation-code.entity';

export class InvitationCodeDto {
  @ApiProperty({ example: '67hdy5' })
  code: string;

  @ApiProperty({ example: '1' })
  colocationId: number;

  @ApiProperty({ example: '2023-05-01T00:00:00.000Z' })
  expiresAt: Date;

  static fromEntity(entity: InvitationCode): InvitationCodeDto {
    return {
      code: entity.code,
      colocationId: entity.colocationId,
      expiresAt: entity.expiresAt,
    };
  }
}
