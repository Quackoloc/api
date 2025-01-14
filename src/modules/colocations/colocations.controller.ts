import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ColocationsService } from './colocations.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateColocationDto } from './dtos/create-colocation.dto';
import { GetConnectedUser } from '../../common/decorators/get-connected-user.decorator';
import { ConnectedUser } from '../auth/connected-user.model';
import { ColocationDto } from './dtos/colocation.dto';

@Controller('colocations')
export class ColocationsController {
  constructor(private colocationsService: ColocationsService) {}

  @ApiOperation({ summary: 'Create a colocation' })
  @ApiBody({ type: CreateColocationDto })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createColocation(
    @Body() createColocationDto: CreateColocationDto,
    @GetConnectedUser() connectedUser: ConnectedUser
  ): Promise<ColocationDto> {
    return await this.colocationsService.createColocation(createColocationDto, connectedUser);
  }
}
