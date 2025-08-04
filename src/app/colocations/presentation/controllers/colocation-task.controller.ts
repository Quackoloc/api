import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { GetColocationTasksUseCase } from '../../application/use-cases/get-colocation-tasks.use-case';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ColocationTaskDto } from '../../application/dtos/colocation-task.dto';
import { CreateColocationTaskDto } from '../../application/dtos/create-colocation-task.dto';
import { CreateColocationTaskUseCase } from '../../application/use-cases/create-colocation-task.use-case';
import { GetConnectedUser } from '../../../../common/decorators/get-connected-user.decorator';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import { ColocationDto } from '../../application/dtos/colocation.dto';
import { RequireColocationMember } from '../decorators/colocation-member.decorator';
import { UpdateColocationTaskDto } from '../../application/dtos/update-colocation-task.dto';
import { UpdateColocationTaskUseCase } from '../../application/use-cases/update-colocation-task.use-case';
import { ChangeColocationTaskStatusUseCase } from '../../application/use-cases/change-colocation-task-status.use-case';
import { UpdateColocationTaskStatusDto } from '../../application/dtos/update-colocation-task-status.dto';
import { DeleteColocationTaskUseCase } from '../../application/use-cases/delete-colocation-task.use-case';

@Controller('colocations/:colocationId/tasks')
export class ColocationTaskController {
  constructor(
    private readonly getColocationTasksUseCase: GetColocationTasksUseCase,
    private readonly createColocationTaskUseCase: CreateColocationTaskUseCase,
    private readonly updateColocationTaskUseCase: UpdateColocationTaskUseCase,
    private readonly changeColocationTaskStatusUseCase: ChangeColocationTaskStatusUseCase,
    private readonly deleteColocationTaskUseCase: DeleteColocationTaskUseCase
  ) {}

  @Get()
  @ApiOkResponse({ type: [ColocationTaskDto] })
  @ApiOperation({ summary: 'Get colocation tasks' })
  @HttpCode(HttpStatus.OK)
  async getColocationTasks(
    @Param('colocationId', ParseIntPipe) colocationId: number
  ): Promise<ColocationTaskDto[]> {
    return await this.getColocationTasksUseCase.execute(colocationId);
  }

  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: ColocationDto })
  @ApiOperation({ summary: 'Create a new colocation task' })
  @HttpCode(HttpStatus.CREATED)
  @RequireColocationMember()
  async createColocationTask(
    @Param('colocationId', ParseIntPipe) colocationId: number,
    @Body() createColocationTaskDto: CreateColocationTaskDto,
    @GetConnectedUser() connectedUser: ConnectedUser
  ): Promise<ColocationTaskDto> {
    return await this.createColocationTaskUseCase.execute(
      colocationId,
      createColocationTaskDto,
      connectedUser
    );
  }

  @Put(':taskId')
  @ApiResponse({ status: HttpStatus.OK })
  @ApiOperation({ summary: 'Update a colocation task' })
  @HttpCode(HttpStatus.OK)
  @RequireColocationMember()
  async update(
    @Param('colocationId', ParseIntPipe) colocationId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() updateColocationTaskDto: UpdateColocationTaskDto,
    @GetConnectedUser() connectedUser: ConnectedUser
  ): Promise<void> {
    return await this.updateColocationTaskUseCase.execute(
      colocationId,
      taskId,
      updateColocationTaskDto,
      connectedUser
    );
  }

  @Put(':taskId/status')
  @ApiResponse({ status: HttpStatus.OK, type: ColocationTaskDto })
  @ApiOperation({ summary: 'Update a colocation task' })
  @HttpCode(HttpStatus.OK)
  @RequireColocationMember()
  async markAsDone(
    @Param('colocationId', ParseIntPipe) colocationId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() updateColocationTaskStatusDto: UpdateColocationTaskStatusDto,
    @GetConnectedUser() connectedUser: ConnectedUser
  ): Promise<void> {
    return await this.changeColocationTaskStatusUseCase.execute(
      colocationId,
      taskId,
      updateColocationTaskStatusDto.status,
      connectedUser
    );
  }

  @Delete(':taskId')
  @ApiResponse({ status: HttpStatus.OK, type: ColocationTaskDto })
  @ApiOperation({ summary: 'Delete a colocation task' })
  @HttpCode(HttpStatus.OK)
  @RequireColocationMember()
  async deleteColocationTask(
    @Param('colocationId', ParseIntPipe) colocationId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @GetConnectedUser() connectedUser: ConnectedUser
  ): Promise<void> {
    return await this.deleteColocationTaskUseCase.execute(taskId, connectedUser);
  }
}
