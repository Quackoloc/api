import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req as ReqDecorator,
  Request,
  Response as ResDecorator,
  UseGuards,
} from '@nestjs/common';
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
import { Request as Req, Response as Res } from 'express';

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
  async login(@Request() req: any, @ResDecorator({ passthrough: true }) res: Res): Promise<void> {
    const tokens = await this.loginUseCase.execute(req.body.email);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.send();
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
  async refreshToken(@ReqDecorator() req: Req): Promise<AccessTokenDto> {
    const refreshToken = req.cookies.refreshToken;
    return this.refreshAccessUseCase.execute(refreshToken);
  }
}
