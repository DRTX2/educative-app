import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LessonsService } from './lessons.service';
import { Lesson } from './domain/lesson';
import { LessonProgress } from './domain/lesson-progress';
import { SaveProgressDto } from './dto/save-progress.dto';
import { CreateLessonDto, UpdateLessonDto } from './dto/manage-lesson.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Lessons')
@Controller({
  path: 'lessons',
  version: '1',
})
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @ApiOkResponse({
    type: Lesson,
    isArray: true,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Lesson[]> {
    return this.lessonsService.findAll();
  }

  @ApiOkResponse({
    type: Lesson,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  findOne(@Param('id') id: string): Promise<Lesson | null> {
    return this.lessonsService.findOne(+id);
  }

  @ApiOkResponse({
    type: LessonProgress,
  })
  @Post('progress')
  @HttpCode(HttpStatus.CREATED)
  saveProgress(
    @Request() request,
    @Body() saveProgressDto: SaveProgressDto,
  ): Promise<LessonProgress> {
    return this.lessonsService.saveProgress(request.user.id, saveProgressDto);
  }

  @ApiOkResponse({
    type: LessonProgress,
    isArray: true,
  })
  @Get('progress/me')
  @HttpCode(HttpStatus.OK)
  getProgress(@Request() request): Promise<LessonProgress[]> {
    return this.lessonsService.getProgress(request.user.id);
  }

  @ApiOkResponse({
    type: Lesson,
    isArray: true,
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('admin/all')
  @HttpCode(HttpStatus.OK)
  findAllForAdmin(): Promise<Lesson[]> {
    return this.lessonsService.findAllForAdmin();
  }

  @ApiOkResponse({
    type: Lesson,
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('admin')
  @HttpCode(HttpStatus.CREATED)
  createLesson(@Body() createLessonDto: CreateLessonDto): Promise<Lesson> {
    return this.lessonsService.createLesson(createLessonDto);
  }

  @ApiOkResponse({
    type: Lesson,
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('admin/:id')
  @HttpCode(HttpStatus.OK)
  updateLesson(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson | null> {
    return this.lessonsService.updateLesson(+id, updateLessonDto);
  }
}
