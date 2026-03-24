export class TaskEntity {
  id?: number;
  clientId: string;
  title: string;
  description: string;
  dueDate: string | null;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  synced: boolean;

  constructor(data: Partial<TaskEntity>) {
    this.id = data.id;
    this.clientId = data.clientId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.dueDate = data.dueDate || null;
    this.completed = data.completed || false;
    this.priority = data.priority || 'medium';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.synced = data.synced || false;
  }
}
