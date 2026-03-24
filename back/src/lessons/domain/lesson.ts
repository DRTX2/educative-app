import { ApiProperty } from '@nestjs/swagger';
import databaseConfig from '../../database/config/database.config';
import { DatabaseConfig } from '../../database/config/database-config.type';

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number;

export class Lesson {
  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @ApiProperty({
    type: String,
    example: 'Matemáticas - Áreas de Cultivo',
  })
  title: string;

  @ApiProperty({
    type: String,
    example: 'Aprende a calcular áreas de terrenos para la siembra',
  })
  description: string;

  @ApiProperty({
    type: Object,
    description: 'Contenido de la lección con preguntas y respuestas',
  })
  content: Record<string, any>;

  @ApiProperty({
    type: String,
    example: 'matematicas',
  })
  category: string;

  @ApiProperty({
    type: String,
    example: 'basica',
    enum: ['basica', 'media', 'avanzada'],
  })
  difficulty: string;

  @ApiProperty({
    type: Number,
    example: 12,
  })
  estimatedMinutes: number;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  published: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
