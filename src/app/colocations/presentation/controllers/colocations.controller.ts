import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateColocationDto } from '../../application/dtos/create-colocation.dto';
import { GetConnectedUser } from '../../../../common/decorators/get-connected-user.decorator';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import { ColocationDto } from '../../application/dtos/colocation.dto';
import { CreateColocationUseCase } from '../../application/use-cases/create-colocation.use-case';
import { GetColocationsUseCase } from '../../application/use-cases/get-colocations.use-case';
import { CreateInvitationCodeDto } from '../../application/dtos/create-invitation-code.dto';
import { RequireColocationMember } from '../decorators/colocation-member.decorator';
import { CreateInvitationCodeUseCase } from '../../application/use-cases/create-invitation-code.use-case';
import { InvitationCodeDto } from '../../application/dtos/invitation-code.dto';
import { JoinColocationDto } from '../../application/dtos/join-colocation.dto';
import { JoinColocationUseCase } from '../../application/use-cases/join-colocation.use-case';
import { UpdateColocationDto } from '../../application/dtos/update-colocation.dto';
import { UpdateColocationUseCase } from '../../application/use-cases/update-colocation.use-case';

@Controller('colocations')
export class ColocationsController {
  constructor(
    private readonly createColocationUseCase: CreateColocationUseCase,
    private readonly getColocationUseCase: GetColocationsUseCase,
    private readonly createInvitationCodeUseCase: CreateInvitationCodeUseCase,
    private readonly joinColocationUseCase: JoinColocationUseCase,
    private readonly updateColocationUseCase: UpdateColocationUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a colocation' })
  @ApiBody({ type: CreateColocationDto })
  @ApiResponse({ status: HttpStatus.OK, type: ColocationDto })
  @HttpCode(HttpStatus.CREATED)
  async createColocation(
    @Body() createColocationDto: CreateColocationDto,
    @GetConnectedUser() connectedUser: ConnectedUser
  ): Promise<ColocationDto> {
    return this.createColocationUseCase.execute(createColocationDto, connectedUser);
  }

  @Get('@me')
  @ApiResponse({ status: HttpStatus.OK, type: ColocationDto })
  @ApiOperation({ summary: "Get user's colocations" })
  @HttpCode(HttpStatus.OK)
  async getColocations(@GetConnectedUser() connectedUser: ConnectedUser): Promise<ColocationDto> {
    return this.getColocationUseCase.execute(connectedUser);
  }

  @Post(':colocationId/invitation-code')
  @ApiResponse({ status: HttpStatus.OK, type: ColocationDto })
  @ApiOperation({ summary: 'Create a colocation invitation code' })
  @HttpCode(HttpStatus.OK)
  @RequireColocationMember()
  async createColocationInvitationCode(
    @Param('colocationId', ParseIntPipe) colocationId: number,
    @Body() createInvitationCodeDto: CreateInvitationCodeDto,
    @GetConnectedUser() connectedUser: ConnectedUser
  ): Promise<InvitationCodeDto> {
    return this.createInvitationCodeUseCase.execute(
      colocationId,
      createInvitationCodeDto.expiresAt,
      connectedUser
    );
  }

  @Post(':colocationId/join')
  @ApiResponse({ status: HttpStatus.OK, type: ColocationDto })
  @ApiOperation({ summary: 'Create a colocation invitation code' })
  @HttpCode(HttpStatus.OK)
  async joinColocation(
    @Body() joinColocationDto: JoinColocationDto,
    @Param('colocationId', ParseIntPipe) colocationId: number,
    @GetConnectedUser() connectedUser: ConnectedUser
  ): Promise<void> {
    return this.joinColocationUseCase.execute(
      colocationId,
      connectedUser.id,
      joinColocationDto.invitationCode
    );
  }

  @Put(':colocationId')
  @ApiResponse({ status: HttpStatus.OK })
  async update(
    @Param('colocationId', ParseIntPipe) colocationId: number,
    @Body() updateColocationDto: UpdateColocationDto,
    @GetConnectedUser() connectedUser: ConnectedUser
  ) {
    await this.updateColocationUseCase.execute(colocationId, updateColocationDto, connectedUser);
  }
}
