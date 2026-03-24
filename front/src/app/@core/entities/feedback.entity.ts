export type FeedbackType = 'task' | 'lesson' | 'general';

export class FeedbackEntity {
  id?: number;
  feedbackType: FeedbackType;
  rating: number;
  comments: string | null;
  metadata: Record<string, any> | null;
  createdAt: Date;
  synced: boolean;

  constructor(data: Partial<FeedbackEntity>) {
    this.id = data.id;
    this.feedbackType = data.feedbackType || 'general';
    this.rating = data.rating || 0;
    this.comments = data.comments || null;
    this.metadata = data.metadata || null;
    this.createdAt = data.createdAt || new Date();
    this.synced = data.synced || false;
  }
}
