import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export class SaveProgressDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  lessonId: number;

  @ApiProperty({
    type: Number,
    example: 85,
  })
  @IsNotEmpty()
  @IsNumber()
  score: number;

  @ApiProperty({
    type: Object,
    description: 'Respuestas del usuario',
    example: {
      question1: 'A',
      question2: 'B',
      question3: 'C',
    },
  })
  @IsNotEmpty()
  @IsObject()
  answers: Record<string, any>;
}
