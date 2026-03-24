import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonEntity } from '../../../../lessons/infrastructure/persistence/relational/entities/lesson.entity';
import { LessonSeedService } from './lesson-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([LessonEntity])],
  providers: [LessonSeedService],
  exports: [LessonSeedService],
})
export class LessonSeedModule {}
