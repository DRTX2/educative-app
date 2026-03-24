import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, firstValueFrom } from 'rxjs';
import { IndexedDbService } from '@core/services/storage/indexeddb.service';
import { NetworkService } from '@core/services/network/network.service';
import { SyncService } from '@core/services/sync/sync.service';
import { TaskEntity } from '@core/entities/task.entity';

@Injectable()
export class TasksService {
  private readonly apiUrl = '/api/v1/tasks';

  constructor(
    private readonly indexedDb: IndexedDbService,
    private readonly http: HttpClient,
    private readonly network: NetworkService,
    private readonly sync: SyncService,
  ) {}

  async initialize(): Promise<void> {
    await this.indexedDb.init();

    if (this.network.isOnline) {
      await this.pullFromServer();
    }
  }

  getAllTasks(): Observable<TaskEntity[]> {
    return from(this.indexedDb.getAll<TaskEntity>('tasks'));
  }

  async getTask(id: number): Promise<TaskEntity | undefined> {
    const task = await this.indexedDb.get<TaskEntity>('tasks', id);
    return task ? new TaskEntity(task) : undefined;
  }

  async createTask(task: Omit<TaskEntity, 'id' | 'createdAt' | 'updatedAt' | 'synced'>): Promise<number> {
    const newTask = new TaskEntity({
      ...task,
      clientId: task.clientId || this.generateClientId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      synced: false,
    });

    const localId = await this.indexedDb.add('tasks', newTask);
    newTask.id = localId;

    await this.syncTask(newTask);

    return localId;
  }

  async updateTask(task: TaskEntity): Promise<void> {
    task.updatedAt = new Date();
    await this.indexedDb.update('tasks', task);
    await this.syncTask(task);
  }

  async toggleComplete(id: number): Promise<void> {
    const task = await this.getTask(id);

    if (!task) {
      return;
    }

    task.completed = !task.completed;
    task.updatedAt = new Date();
    await this.indexedDb.update('tasks', task);
    await this.syncTask(task);
  }

  async deleteTask(id: number): Promise<void> {
    const task = await this.getTask(id);
    await this.indexedDb.delete('tasks', id);

    if (!task?.clientId) {
      return;
    }

    if (this.network.isOnline) {
      try {
        await firstValueFrom(this.http.delete(`${this.apiUrl}/client/${task.clientId}`));
      } catch (error) {
        await this.sync.queueAction('DELETE', `${this.apiUrl}/client/${task.clientId}`);
      }
    } else {
      await this.sync.queueAction('DELETE', `${this.apiUrl}/client/${task.clientId}`);
    }
  }

  async getTasksCount(): Promise<{ total: number; completed: number; pending: number }> {
    const tasks = await this.indexedDb.getAll<TaskEntity>('tasks');

    return {
      total: tasks.length,
      completed: tasks.filter((task) => task.completed).length,
      pending: tasks.filter((task) => !task.completed).length,
    };
  }

  async pullFromServer(): Promise<void> {
    const remoteTasks = await firstValueFrom(this.http.get<TaskEntity[]>(`${this.apiUrl}/me`));
    const localTasks = (await this.indexedDb.getAll<TaskEntity>('tasks')).map((task) => new TaskEntity(task));

    for (const remoteTask of remoteTasks.map((task) => new TaskEntity({ ...task, synced: true }))) {
      const localTask = localTasks.find((task) => task.clientId === remoteTask.clientId);

      if (localTask?.id) {
        await this.indexedDb.update('tasks', {
          ...remoteTask,
          id: localTask.id,
          synced: true,
        });
      } else {
        await this.indexedDb.add('tasks', {
          ...remoteTask,
          synced: true,
        });
      }
    }
  }

  private async syncTask(task: TaskEntity): Promise<void> {
    const payload = this.serializeTask(task);

    if (this.network.isOnline) {
      try {
        await firstValueFrom(this.http.post<TaskEntity>(this.apiUrl, payload));
        await this.indexedDb.update('tasks', {
          ...task,
          synced: true,
        });
      } catch (error) {
        await this.sync.queueAction('POST', this.apiUrl, payload);
      }
    } else {
      await this.sync.queueAction('POST', this.apiUrl, payload);
    }
  }

  private serializeTask(task: TaskEntity) {
    return {
      clientId: task.clientId,
      title: task.title,
      description: task.description || null,
      dueDate: task.dueDate || null,
      priority: task.priority,
      completed: task.completed,
    };
  }

  private generateClientId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }

    return `task-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
