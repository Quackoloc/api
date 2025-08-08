import { Body, Controller, Get, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../../application/dtos/user.dto';
import { GetConnectedUser } from '../../../../common/decorators/get-connected-user.decorator';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';
import { UpdateUserProfileUseCase } from '../../application/use-cases/update-user-profile.use-case';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { ResetPasswordDto } from '../../application/dtos/reset-password.dto';
import { ResetPasswordUseCase } from '../../application/use-cases/reset-password.use-case';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase
  ) {}

  @Get('@me')
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @ApiOperation({ summary: "Get user's profile" })
  async me(@GetConnectedUser() connectedUser: ConnectedUser): Promise<UserDto> {
    return this.getUserUseCase.execute(connectedUser.id);
  }

  @Put('@me')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  @ApiOperation({ summary: "Update user's profile" })
  async updateMe(
    @GetConnectedUser() connectedUser: ConnectedUser,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<void> {
    return await this.updateUserProfileUseCase.execute(updateUserDto, connectedUser);
  }

  @Put('@me/reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiOperation({ summary: 'Reset user password' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @GetConnectedUser() connectedUser: ConnectedUser
  ): Promise<void> {
    await this.resetPasswordUseCase.execute(resetPasswordDto, connectedUser);
  }
}
