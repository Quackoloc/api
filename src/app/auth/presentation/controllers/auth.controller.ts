import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGard } from '../../../../common/guards/local-auth.guard';
import { RefreshTokenDto } from '../../application/dtos/refresh-token.dto';
import { TokensDto } from '../../application/dtos/tokens.dto';
import { AccessTokenDto } from '../../application/dtos/access-token.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../../../user/application/dtos/create-user.dto';
import { UserDto } from '../../../user/application/dtos/user.dto';
import { Public } from '../../../../common/decorators/public.decorator';
import { LoginDto } from '../../application/dtos/login.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { CreateUserUseCase } from '../../../user/application/use-cases/create-user.use-case';
import { RefreshAccessTokenUseCase } from '../../application/use-cases/refresh-access-token.use-case';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshAccessUseCase: RefreshAccessTokenUseCase
  ) {}

  @Public()
  @ApiOperation({ summary: 'Login with credentials' })
  @ApiResponse({ status: HttpStatus.OK, type: TokensDto })
  @ApiBody({ type: LoginDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGard)
  @Post('login')
  async login(@Request() req: any): Promise<TokensDto> {
    return this.loginUseCase.execute(req.body.email);
  }

  @Public()
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserDto })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Public()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: HttpStatus.OK, type: AccessTokenDto })
  @Post('refresh')
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<AccessTokenDto> {
    return this.refreshAccessUseCase.execute(dto.refreshToken);
  }
}
