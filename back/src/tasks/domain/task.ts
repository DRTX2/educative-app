import { ApiProperty } from '@nestjs/swagger';
import databaseConfig from '../../database/config/database.config';
import { DatabaseConfig } from '../../database/config/database-config.type';
import { User } from '../../users/domain/user';
import { TaskPriorityEnum } from '../infrastructure/persistence/relational/entities/task.entity';

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;

export class Task {
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
    example: 'offline-task-001',
  })
  clientId: string;

  @ApiProperty({
    type: String,
    example: 'Repasar regla de tres',
  })
  title: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    enum: TaskPriorityEnum,
    example: TaskPriorityEnum.MEDIUM,
  })
  priority: TaskPriorityEnum;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  dueDate: Date | null;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  completed: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
