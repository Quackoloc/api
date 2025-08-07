import { applyDecorators, UseGuards } from '@nestjs/common';
import { ColocationMemberGuard } from '../guards/colocation-member.guard';

export const RequireColocationMember = () => {
  return applyDecorators(UseGuards(ColocationMemberGuard));
};
