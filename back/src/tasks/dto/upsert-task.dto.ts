import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskPriorityEnum } from '../infrastructure/persistence/relational/entities/task.entity';

export class UpsertTaskDto {
  @ApiProperty({
    example: 'offline-task-001',
  })
  @IsString()
  @MaxLength(120)
  clientId: string;

  @ApiProperty({
    example: 'Repasar ciclo del agua',
  })
  @IsString()
  @MaxLength(160)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    enum: TaskPriorityEnum,
    example: TaskPriorityEnum.MEDIUM,
  })
  @IsEnum(TaskPriorityEnum)
  priority: TaskPriorityEnum;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string | null;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  completed: boolean;
}
