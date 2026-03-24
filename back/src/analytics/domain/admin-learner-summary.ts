import { ApiProperty } from '@nestjs/swagger';

export class AdminLearnerSummary {
  @ApiProperty()
  id: number;

  @ApiProperty()
  fullName: string;

  @ApiProperty({
    nullable: true,
  })
  email: string | null;

  @ApiProperty()
  role: string;

  @ApiProperty({
    nullable: true,
  })
  status: string | null;

  @ApiProperty()
  tasksCompleted: number;

  @ApiProperty()
  tasksPending: number;

  @ApiProperty()
  lessonsCompleted: number;

  @ApiProperty()
  averageScore: number;

  @ApiProperty({
    nullable: true,
  })
  lastActivityAt: Date | null;

  @ApiProperty({
    example: 'high',
  })
  riskLevel: 'high' | 'medium' | 'low';
}
