import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { LessonEntity } from './infrastructure/persistence/relational/entities/lesson.entity';
import { LessonProgressEntity } from './infrastructure/persistence/relational/entities/lesson-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LessonEntity, LessonProgressEntity])],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
