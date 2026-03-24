import { ApiProperty } from '@nestjs/swagger';
import databaseConfig from '../../database/config/database.config';
import { DatabaseConfig } from '../../database/config/database-config.type';
import { User } from '../../users/domain/user';
import { Lesson } from './lesson';

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;

export class LessonProgress {
  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @ApiProperty({
    type: () => Lesson,
  })
  lesson: Lesson;

  @ApiProperty({
    type: () => User,
  })
  user: User;

  @ApiProperty({
    type: Number,
    example: 85,
  })
  score: number;

  @ApiProperty({
    type: Object,
    description: 'Respuestas del usuario',
  })
  answers: Record<string, any>;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  completed: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
