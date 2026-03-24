export interface LessonQuestion {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

export interface LessonContent {
  introduction?: string;
  text?: string;
  questions: LessonQuestion[];
}

export class LessonEntity {
  id: number;
  title: string;
  description: string;
  content: LessonContent;
  category: string;
  difficulty: 'basica' | 'media' | 'avanzada';
  estimatedMinutes: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<LessonEntity>) {
    this.id = data.id || 0;
    this.title = data.title || '';
    this.description = data.description || '';
    this.content = data.content || { questions: [] };
    this.category = data.category || '';
    this.difficulty = data.difficulty || 'basica';
    this.estimatedMinutes = data.estimatedMinutes || 10;
    this.published = data.published ?? true;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }
}
