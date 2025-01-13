import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGard } from '../guards/local-auth.guard';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { TokensDto } from '../dtos/tokens.dto';
import { AccessTokenDto } from '../dtos/access-token.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthServiceGateway } from '../gateways/auth.service.gateway';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UserDto } from '../../users/dto/user.dto';
import { Public } from '../guards/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authServiceGateway: AuthServiceGateway) {}

  @Public()
  @ApiOperation({ summary: 'Login with credentials' })
  @ApiResponse({ status: HttpStatus.OK, type: TokensDto })
  @UseGuards(LocalAuthGard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req: any): Promise<TokensDto> {
    return this.authServiceGateway.login(req.body.email);
  }

  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserDto })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.authServiceGateway.register(createUserDto);
  }

  @Public()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: HttpStatus.OK, type: AccessTokenDto })
  @Post('refresh')
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<AccessTokenDto> {
    return this.authServiceGateway.refresh(dto.refreshToken);
  }
}
