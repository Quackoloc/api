import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateColocationDto } from '../../application/dtos/create-colocation.dto';
import { GetConnectedUser } from '../../../../common/decorators/get-connected-user.decorator';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import { ColocationDto } from '../../application/dtos/colocation.dto';
import { CreateColocationUseCase } from '../../application/use-cases/create-colocation.use-case';
import { GetColocationsUseCase } from '../../application/use-cases/get-colocations.use-case';

@Controller('colocations')
export class ColocationsController {
  constructor(
    private readonly createColocationUseCase: CreateColocationUseCase,
    private readonly getColocationUseCase: GetColocationsUseCase
  ) {}

  @ApiOperation({ summary: 'Create a colocation' })
  @ApiBody({ type: CreateColocationDto })
  @ApiResponse({ status: HttpStatus.OK, type: ColocationDto })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createColocation(
    @Body() createColocationDto: CreateColocationDto,
    @GetConnectedUser() connectedUser: ConnectedUser
  ): Promise<ColocationDto> {
    return await this.createColocationUseCase.execute(createColocationDto, connectedUser);
  }

  @ApiResponse({ status: HttpStatus.OK, type: ColocationDto })
  @ApiOperation({ summary: "Get user's colocations" })
  @HttpCode(HttpStatus.OK)
  @Get('@me')
  async getColocations(@GetConnectedUser() connectedUser: ConnectedUser): Promise<ColocationDto> {
    return await this.getColocationUseCase.execute(connectedUser);
  }
}
