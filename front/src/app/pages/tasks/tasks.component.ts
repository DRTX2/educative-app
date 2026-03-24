import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HotToastService } from '@ngxpert/hot-toast';
import { TaskEntity } from '@core/entities/task.entity';
import { TasksService } from './services/tasks.service';

interface TaskTemplate {
  title: string;
  description: string;
  priority: TaskEntity['priority'];
}

@UntilDestroy()
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [TasksService],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  tasks: TaskEntity[] = [];
  filter: 'all' | 'pending' | 'completed' = 'all';
  showModal = false;
  isCreating = false;
  newTask: Partial<TaskEntity> = this.createEmptyTask();

  filterTabs = [
    { value: 'all' as const, label: 'Todas' },
    { value: 'pending' as const, label: 'Pendientes' },
    { value: 'completed' as const, label: 'Completadas' },
  ];

  templates: TaskTemplate[] = [
    {
      title: 'Repasar una lección de matemáticas',
      description: 'Dedica 15 minutos a reforzar cálculo útil para la vida diaria.',
      priority: 'medium',
    },
    {
      title: 'Escribir una idea aprendida hoy',
      description: 'Registra en pocas líneas algo que puedas explicar a otra persona.',
      priority: 'low',
    },
    {
      title: 'Preparar materiales para estudiar mañana',
      description: 'Deja listo cuaderno, lápiz y una meta corta para iniciar con energía.',
      priority: 'high',
    },
  ];

  constructor(
    private readonly tasksService: TasksService,
    private readonly toast: HotToastService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.tasksService.initialize();
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasksService
      .getAllTasks()
      .pipe(untilDestroyed(this))
      .subscribe((tasks) => {
        this.tasks = tasks
          .map((task) => new TaskEntity(task))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      });
  }

  filteredTasks(): TaskEntity[] {
    switch (this.filter) {
      case 'pending':
        return this.tasks.filter((task) => !task.completed);
      case 'completed':
        return this.tasks.filter((task) => task.completed);
      default:
        return this.tasks;
    }
  }

  getTaskCount(tab: 'all' | 'pending' | 'completed'): number {
    switch (tab) {
      case 'pending':
        return this.tasks.filter((task) => !task.completed).length;
      case 'completed':
        return this.tasks.filter((task) => task.completed).length;
      default:
        return this.tasks.length;
    }
  }

  getCompletionRate(): number {
    return this.tasks.length ? Math.round((this.getTaskCount('completed') / this.tasks.length) * 100) : 0;
  }

  getHighPriorityPending(): number {
    return this.tasks.filter((task) => !task.completed && task.priority === 'high').length;
  }

  getDueSoonCount(): number {
    const today = new Date();
    return this.tasks.filter((task) => {
      if (!task.dueDate || task.completed) {
        return false;
      }

      const dueDate = new Date(task.dueDate);
      const diff = Math.ceil((dueDate.getTime() - today.getTime()) / 86400000);
      return diff >= 0 && diff <= 2;
    }).length;
  }

  openCreateModal(template?: TaskTemplate): void {
    this.showModal = true;
    this.newTask = template
      ? {
          title: template.title,
          description: template.description,
          priority: template.priority,
          dueDate: null,
        }
      : this.createEmptyTask();
  }

  closeModal(event?: MouseEvent): void {
    if (event && event.target !== event.currentTarget) {
      return;
    }

    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newTask = this.createEmptyTask();
    this.isCreating = false;
  }

  formatDate(date: string | null): string {
    if (!date) {
      return 'Sin fecha';
    }

    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
    };

    return labels[priority] || priority;
  }

  getPriorityTone(priority: TaskEntity['priority']): string {
    return {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high',
    }[priority];
  }

  getProgressMessage(): string {
    const rate = this.getCompletionRate();

    if (rate >= 80) {
      return 'Tu organización está fuerte. Mantén el hábito con tareas pequeñas y claras.';
    }

    if (rate >= 50) {
      return 'Ya hay buen ritmo. Resolver una misión más hoy te deja muy bien posicionado.';
    }

    return 'Empieza con una tarea simple. Cuando una misión es concreta, avanzar cuesta menos.';
  }

  async createTask(): Promise<void> {
    if (!this.newTask.title) {
      this.toast.warning('El título es requerido');
      return;
    }

    this.isCreating = true;

    try {
      await this.tasksService.createTask(this.newTask as Omit<TaskEntity, 'id' | 'createdAt' | 'updatedAt' | 'synced'>);
      this.toast.success('Tarea creada correctamente');
      this.closeModal();
      this.loadTasks();
    } catch (error) {
      this.toast.error('No se pudo crear la tarea');
      console.error(error);
    } finally {
      this.isCreating = false;
    }
  }

  async toggleComplete(task: TaskEntity): Promise<void> {
    if (!task.id) {
      return;
    }

    const wasCompleted = task.completed;

    try {
      await this.tasksService.toggleComplete(task.id);
      this.loadTasks();
      this.toast.success(wasCompleted ? 'La tarea volvió a pendientes' : 'Excelente, tarea completada');
    } catch (error) {
      this.toast.error('No se pudo actualizar la tarea');
      console.error(error);
    }
  }

  async deleteTask(task: TaskEntity): Promise<void> {
    if (!task.id) {
      return;
    }

    if (confirm('¿Deseas eliminar esta tarea?')) {
      try {
        await this.tasksService.deleteTask(task.id);
        this.loadTasks();
        this.toast.success('Tarea eliminada');
      } catch (error) {
        this.toast.error('No se pudo eliminar la tarea');
        console.error(error);
      }
    }
  }

  trackByTaskId(_: number, task: TaskEntity): number | undefined {
    return task.id;
  }

  private createEmptyTask(): Partial<TaskEntity> {
    return {
      title: '',
      description: '',
      dueDate: null,
      priority: 'medium',
    };
  }
}
