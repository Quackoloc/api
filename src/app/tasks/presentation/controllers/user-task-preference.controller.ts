import { Body, Controller, HttpCode, HttpStatus, Param, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserTaskPreferenceDto } from '../../application/dtos/user-task-preference.dto';
import { ChangeUserTaskPreferenceUseCase } from '../../application/use-cases/change-user-task-preference.use-case';
import { UpdateUserTaskPreferenceDto } from '../../application/dtos/update-user-task-preference.dto';
import { GetConnectedUser } from '../../../../common/decorators/get-connected-user.decorator';
import { ConnectedUser } from '../../../../common/types/connected-user.type';

@Controller('colocations/:colocationId/tasks/:taskId/preferences')
export class UserTaskPreferenceController {
  constructor(private readonly changeUserTaskPreferencesUseCase: ChangeUserTaskPreferenceUseCase) {}

  @Put()
  @ApiResponse({ status: HttpStatus.OK, type: UserTaskPreferenceDto })
  @ApiOkResponse({ type: UserTaskPreferenceDto })
  @ApiOperation({ summary: 'Update user task preference' })
  @HttpCode(HttpStatus.OK)
  async updateTaskPreference(
    @Param('colocationId') colocationId: number,
    @Param('taskId') taskId: number,
    @Body() dto: UpdateUserTaskPreferenceDto,
    @GetConnectedUser() connectedUser: ConnectedUser
  ): Promise<UserTaskPreferenceDto> {
    return await this.changeUserTaskPreferencesUseCase.execute(
      colocationId,
      taskId,
      dto.userId,
      dto.isOptedIn,
      connectedUser
    );
  }
}
