import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum, IsObject, Min, Max } from 'class-validator';

export enum FeedbackTypeEnum {
  TASK = 'task',
  LESSON = 'lesson',
  GENERAL = 'general',
}

export class CreateFeedbackDto {
  @ApiProperty({
    type: String,
    enum: FeedbackTypeEnum,
    example: FeedbackTypeEnum.LESSON,
  })
  @IsNotEmpty()
  @IsEnum(FeedbackTypeEnum)
  feedbackType: FeedbackTypeEnum;

  @ApiProperty({
    type: Number,
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    type: String,
    example: 'Me gustó mucho la lección',
    required: false,
  })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiProperty({
    type: Object,
    required: false,
    description: 'Metadata adicional (lessonId, taskId, etc.)',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
