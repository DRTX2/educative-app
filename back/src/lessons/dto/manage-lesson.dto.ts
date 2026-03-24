import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LessonOptionDto {
  @ApiProperty()
  @IsString()
  @MaxLength(8)
  id: string;

  @ApiProperty()
  @IsString()
  text: string;
}

class LessonQuestionDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty({ type: LessonOptionDto, isArray: true })
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => LessonOptionDto)
  options: LessonOptionDto[];

  @ApiProperty()
  @IsString()
  correctAnswer: string;

  @ApiProperty()
  @IsString()
  explanation: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hint?: string;
}

class LessonContentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  introduction?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({ type: LessonQuestionDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LessonQuestionDto)
  questions: LessonQuestionDto[];
}

export class CreateLessonDto {
  @ApiProperty()
  @IsString()
  @MaxLength(180)
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({
    enum: ['matematicas', 'ciencias', 'lengua'],
  })
  @IsString()
  category: string;

  @ApiProperty({
    enum: ['basica', 'media', 'avanzada'],
  })
  @IsEnum(['basica', 'media', 'avanzada'])
  difficulty: 'basica' | 'media' | 'avanzada';

  @ApiProperty()
  @IsNumber()
  estimatedMinutes: number;

  @ApiProperty()
  @IsBoolean()
  published: boolean;

  @ApiProperty({ type: LessonContentDto })
  @IsObject()
  @ValidateNested()
  @Type(() => LessonContentDto)
  content: LessonContentDto;
}

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}
