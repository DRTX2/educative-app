import { ApiProperty } from '@nestjs/swagger';

export class MyLearningOverview {
  @ApiProperty()
  tasksTotal: number;

  @ApiProperty()
  tasksCompleted: number;

  @ApiProperty()
  tasksPending: number;

  @ApiProperty()
  lessonsCompleted: number;

  @ApiProperty()
  averageScore: number;

  @ApiProperty()
  bestScore: number;

  @ApiProperty()
  feedbackCount: number;
}
