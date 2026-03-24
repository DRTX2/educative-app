export class LessonProgressEntity {
  id?: number;
  lessonId: number;
  score: number;
  answers: Record<string, string>;
  completed: boolean;
  completedAt: Date | null;
  updatedAt: Date | null;
  synced: boolean;

  constructor(data: Partial<LessonProgressEntity>) {
    this.id = data.id;
    this.lessonId = data.lessonId || 0;
    this.score = data.score || 0;
    this.answers = data.answers || {};
    this.completed = data.completed ?? true;
    this.completedAt = data.completedAt ? new Date(data.completedAt) : null;
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
    this.synced = data.synced || false;
  }
}
