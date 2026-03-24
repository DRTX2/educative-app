import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { IndexedDbService } from '@core/services/storage/indexeddb.service';
import { TaskEntity } from '@core/entities/task.entity';
import { LessonProgressEntity } from '@core/entities/lesson-progress.entity';
import { FeedbackEntity } from '@core/entities/feedback.entity';
import { LessonEntity } from '@core/entities/lesson.entity';
import { LearningAnalyticsService } from '@core/services/analytics/learning-analytics.service';
import { NetworkService } from '@core/services/network/network.service';
import { starterLessons } from '@core/constants/starter-lessons';

interface DashboardAction {
  label: string;
  description: string;
  route: string;
  accent: 'primary' | 'warm' | 'soft';
}

interface DashboardMetric {
  label: string;
  value: string;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  tasksCount = { total: 0, pending: 0, completed: 0 };
  lessonsCount = { total: 0, completed: 0 };
  feedbackCount = 0;
  pendingTasks: TaskEntity[] = [];
  completionPercentage = 0;
  averageScore = 0;
  bestScore = 0;
  isLoading = true;
  metrics: DashboardMetric[] = [];

  quickActions: DashboardAction[] = [
    {
      label: 'Explorar una lección',
      description: 'Avanza con contenido breve, contextualizado y listo para funcionar offline.',
      route: '/lessons',
      accent: 'primary',
    },
    {
      label: 'Planear el día',
      description: 'Convierte tus actividades en pequeñas misiones para mantener el ritmo.',
      route: '/tasks',
      accent: 'warm',
    },
    {
      label: 'Compartir tu voz',
      description: 'Cuenta qué te gustó y qué podemos mejorar para tu comunidad.',
      route: '/feedback',
      accent: 'soft',
    },
  ];

  constructor(
    private readonly indexedDb: IndexedDbService,
    private readonly analyticsService: LearningAnalyticsService,
    private readonly network: NetworkService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.indexedDb.init();
    await this.loadStats();
  }

  async loadStats(): Promise<void> {
    try {
      const [tasks, lessons, progress, feedback] = await Promise.all([
        this.indexedDb.getAll<TaskEntity>('tasks'),
        this.indexedDb.getAll<LessonEntity>('lessons'),
        this.indexedDb.getAll<LessonProgressEntity>('lesson_progress'),
        this.indexedDb.getAll<FeedbackEntity>('feedback'),
      ]);

      const normalizedTasks = tasks.map((task) => new TaskEntity(task));
      const normalizedProgress = progress.map((entry) => new LessonProgressEntity(entry));

      this.tasksCount = {
        total: normalizedTasks.length,
        pending: normalizedTasks.filter((task) => !task.completed).length,
        completed: normalizedTasks.filter((task) => task.completed).length,
      };

      const availableLessons = lessons.length ? lessons : starterLessons;

      this.lessonsCount = {
        total: availableLessons.length,
        completed: normalizedProgress.filter((item) => item.completed || item.completedAt).length,
      };

      this.feedbackCount = feedback.length;
      this.pendingTasks = normalizedTasks
        .filter((task) => !task.completed)
        .sort((first, second) => this.getDueTime(first) - this.getDueTime(second))
        .slice(0, 4);

      const totalItems = this.tasksCount.total + this.lessonsCount.total;
      const completedItems = this.tasksCount.completed + this.lessonsCount.completed;
      this.completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
      this.averageScore = normalizedProgress.length
        ? Math.round(
            normalizedProgress.reduce((sum, item) => sum + item.score, 0) / normalizedProgress.length,
          )
        : 0;
      this.bestScore = normalizedProgress.length
        ? Math.max(...normalizedProgress.map((item) => item.score))
        : 0;

      if (this.network.isOnline) {
        try {
          const overview = await firstValueFrom(this.analyticsService.getMyOverview());
          this.tasksCount = {
            total: overview.tasksTotal,
            pending: overview.tasksPending,
            completed: overview.tasksCompleted,
          };
          this.feedbackCount = overview.feedbackCount;
          this.averageScore = overview.averageScore;
          this.bestScore = overview.bestScore;
          const totalItems = this.tasksCount.total + this.lessonsCount.total;
          const completedItems = this.tasksCount.completed + this.lessonsCount.completed;
          this.completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        } catch (error) {
          console.error('No se pudo cargar la analítica remota del tablero:', error);
        }
      }

      this.refreshMetrics();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  getGreeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Buenos días';
    }

    if (hour < 18) {
      return 'Buenas tardes';
    }

    return 'Buenas noches';
  }

  getProgressNarrative(): string {
    if (this.completionPercentage >= 80) {
      return 'Tu constancia ya se nota: mantén este impulso.';
    }

    if (this.completionPercentage >= 50) {
      return 'Vas muy bien. Un pequeño esfuerzo más te deja en zona de dominio.';
    }

    if (this.completionPercentage >= 20) {
      return 'Hay tracción. Prioriza una lección corta o una tarea rápida hoy.';
    }

    return 'Cada avance cuenta. Empezar con una misión sencilla puede cambiar el día.';
  }

  getDueLabel(task: TaskEntity): string {
    if (!task.dueDate) {
      return 'Sin fecha límite';
    }

    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const due = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()).getTime();
    const current = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const diff = Math.round((due - current) / 86400000);

    if (diff < 0) {
      return 'Atrasada';
    }

    if (diff === 0) {
      return 'Para hoy';
    }

    if (diff === 1) {
      return 'Para mañana';
    }

    return `En ${diff} días`;
  }

  getPriorityTone(priority: TaskEntity['priority']): string {
    return {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high',
    }[priority];
  }

  trackByTask(_: number, task: TaskEntity): number | undefined {
    return task.id;
  }

  private refreshMetrics(): void {
    this.metrics = [
      {
        label: 'Ritmo actual',
        value: `${this.completionPercentage}%`,
        description: this.getProgressNarrative(),
      },
      {
        label: 'Mejor logro',
        value: this.bestScore ? `${this.bestScore}/100` : 'Sin registros',
        description: 'Tu mejor resultado reciente muestra hasta dónde puedes llegar.',
      },
      {
        label: 'Promedio de dominio',
        value: this.averageScore ? `${this.averageScore}/100` : 'En inicio',
        description: 'Sirve para detectar si conviene repasar o seguir avanzando.',
      },
    ];
  }

  private getDueTime(task: TaskEntity): number {
    return task.dueDate ? new Date(task.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
  }
}
