import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { TaskEntity } from '../tasks/infrastructure/persistence/relational/entities/task.entity';
import { LessonProgressEntity } from '../lessons/infrastructure/persistence/relational/entities/lesson-progress.entity';
import { FeedbackEntity } from '../feedback/infrastructure/persistence/relational/entities/feedback.entity';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';
import { LessonEntity } from '../lessons/infrastructure/persistence/relational/entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, LessonProgressEntity, FeedbackEntity, UserEntity, LessonEntity])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
