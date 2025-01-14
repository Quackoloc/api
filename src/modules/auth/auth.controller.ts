import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGard } from '../../common/guards/local-auth.guard';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { TokensDto } from './dtos/tokens.dto';
import { AccessTokenDto } from './dtos/access-token.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDto } from '../users/dto/user.dto';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Login with credentials' })
  @ApiResponse({ status: HttpStatus.OK, type: TokensDto })
  @ApiBody({ type: LoginDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGard)
  @Post('login')
  async login(@Request() req: any): Promise<TokensDto> {
    return this.authService.login(req.body.email);
  }

  @Public()
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserDto })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.authService.register(createUserDto);
  }

  @Public()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: HttpStatus.OK, type: AccessTokenDto })
  @Post('refresh')
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<AccessTokenDto> {
    return this.authService.refresh(dto.refreshToken);
  }
}
