import { ApiProperty } from '@nestjs/swagger';
import databaseConfig from '../../database/config/database.config';
import { DatabaseConfig } from '../../database/config/database-config.type';
import { User } from '../../users/domain/user';

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;

export enum FeedbackTypeEnum {
  TASK = 'task',
  LESSON = 'lesson',
  GENERAL = 'general',
}

export class Feedback {
  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @ApiProperty({
    type: () => User,
  })
  user: User;

  @ApiProperty({
    type: String,
    enum: FeedbackTypeEnum,
    example: FeedbackTypeEnum.LESSON,
  })
  feedbackType: FeedbackTypeEnum;

  @ApiProperty({
    type: Number,
    example: 5,
  })
  rating: number;

  @ApiProperty({
    type: String,
    example: 'Me gustó mucho la lección',
  })
  comments: string | null;

  @ApiProperty({
    type: Object,
  })
  metadata: Record<string, any> | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
