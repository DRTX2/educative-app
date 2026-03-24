import { ApiProperty } from '@nestjs/swagger';

class RecentFeedbackItem {
  @ApiProperty()
  learner: string;

  @ApiProperty()
  feedbackType: string;

  @ApiProperty()
  rating: number;

  @ApiProperty({
    nullable: true,
  })
  comments: string | null;

  @ApiProperty()
  createdAt: Date;
}

export class AdminLearningOverview {
  @ApiProperty()
  totalLearners: number;

  @ApiProperty()
  activeLearners: number;

  @ApiProperty()
  totalTasks: number;

  @ApiProperty()
  completedTasks: number;

  @ApiProperty()
  totalLessonAttempts: number;

  @ApiProperty()
  averageLessonScore: number;

  @ApiProperty({
    type: RecentFeedbackItem,
    isArray: true,
  })
  recentFeedback: RecentFeedbackItem[];
}
