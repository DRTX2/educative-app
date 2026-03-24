import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Task } from './domain/task';
import { TasksService } from './tasks.service';
import { UpsertTaskDto } from './dto/upsert-task.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Tasks')
@Controller({
  path: 'tasks',
  version: '1',
})
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOkResponse({
    type: Task,
    isArray: true,
  })
  @Get('me')
  @HttpCode(HttpStatus.OK)
  findMyTasks(@Request() request): Promise<Task[]> {
    return this.tasksService.findByUser(request.user.id);
  }

  @ApiCreatedResponse({
    type: Task,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  upsert(@Request() request, @Body() upsertTaskDto: UpsertTaskDto): Promise<Task> {
    return this.tasksService.upsert(request.user.id, upsertTaskDto);
  }

  @ApiNoContentResponse()
  @Delete('client/:clientId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'clientId',
    type: String,
    required: true,
  })
  remove(@Request() request, @Param('clientId') clientId: string): Promise<void> {
    return this.tasksService.removeByClientId(request.user.id, clientId);
  }
}
