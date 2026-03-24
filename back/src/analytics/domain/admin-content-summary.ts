import { ApiProperty } from '@nestjs/swagger';

export class AdminContentSummary {
  @ApiProperty()
  lessonId: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  difficulty: string;

  @ApiProperty()
  totalAttempts: number;

  @ApiProperty()
  completions: number;

  @ApiProperty()
  averageScore: number;
}
