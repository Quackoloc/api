import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ColocationsService } from './colocations.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateColocationDto } from './dtos/create-colocation.dto';
import { GetConnectedUser } from '../../common/decorators/get-connected-user.decorator';
import { ConnectedUser } from '../auth/connected-user.model';
import { ColocationDto } from './dtos/colocation.dto';

@Controller('colocations')
export class ColocationsController {
  constructor(private colocationsService: ColocationsService) {}

  @ApiOperation({ summary: 'Create a colocation' })
  @ApiBody({ type: CreateColocationDto })
  @ApiResponse({ status: HttpStatus.OK, type: ColocationDto })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createColocation(
    @Body() createColocationDto: CreateColocationDto,
    @GetConnectedUser() connectedUser: ConnectedUser
  ): Promise<ColocationDto> {
    return await this.colocationsService.createColocation(createColocationDto, connectedUser);
  }

  @ApiResponse({ status: HttpStatus.OK, type: ColocationDto })
  @ApiOperation({ summary: "Get user's colocations" })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getColocations(@GetConnectedUser() connectedUser: ConnectedUser): Promise<ColocationDto[]> {
    //Promise<ColocationDto[]> {
    return await this.colocationsService.getColocations(connectedUser);
  }
}
