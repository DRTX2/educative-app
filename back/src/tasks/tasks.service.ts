import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './infrastructure/persistence/relational/entities/task.entity';
import { UpsertTaskDto } from './dto/upsert-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
  ) {}

  async findByUser(userId: number): Promise<TaskEntity[]> {
    return this.tasksRepository.find({
      where: {
        user: { id: userId },
      },
      order: {
        dueDate: 'ASC',
        updatedAt: 'DESC',
      },
    });
  }

  async upsert(userId: number, upsertTaskDto: UpsertTaskDto): Promise<TaskEntity> {
    const existingTask = await this.tasksRepository.findOne({
      where: {
        user: { id: userId },
        clientId: upsertTaskDto.clientId,
      },
    });

    if (existingTask) {
      existingTask.title = upsertTaskDto.title;
      existingTask.description = upsertTaskDto.description || null;
      existingTask.priority = upsertTaskDto.priority;
      existingTask.dueDate = upsertTaskDto.dueDate ? new Date(upsertTaskDto.dueDate) : null;
      existingTask.completed = upsertTaskDto.completed;

      return this.tasksRepository.save(existingTask);
    }

    const task = this.tasksRepository.create({
      user: { id: userId } as any,
      clientId: upsertTaskDto.clientId,
      title: upsertTaskDto.title,
      description: upsertTaskDto.description || null,
      priority: upsertTaskDto.priority,
      dueDate: upsertTaskDto.dueDate ? new Date(upsertTaskDto.dueDate) : null,
      completed: upsertTaskDto.completed,
    });

    return this.tasksRepository.save(task);
  }

  async removeByClientId(userId: number, clientId: string): Promise<void> {
    const task = await this.tasksRepository.findOne({
      where: {
        user: { id: userId },
        clientId,
      },
    });

    if (!task) {
      return;
    }

    await this.tasksRepository.remove(task);
  }
}
