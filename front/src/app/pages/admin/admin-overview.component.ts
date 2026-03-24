import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import {
  LearningAnalyticsService,
  AdminContentSummary,
  AdminLearnerSummary,
  AdminLearningOverview,
} from '@core/services/analytics/learning-analytics.service';
import { FormsModule } from '@angular/forms';
import { LessonEntity } from '@core/entities/lesson.entity';
import { AdminLessonsService } from './services/admin-lessons.service';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-overview.component.html',
  styleUrl: './admin-overview.component.scss',
})
export class AdminOverviewComponent implements OnInit {
  overview: AdminLearningOverview | null = null;
  learners: AdminLearnerSummary[] = [];
  contentSummary: AdminContentSummary[] = [];
  managedLessons: LessonEntity[] = [];
  isLoading = true;
  riskFilter: 'all' | 'high' | 'medium' | 'low' = 'all';
  learnerSearch = '';
  isSavingLesson = false;
  editingLessonId: number | null = null;
  lessonForm: Partial<LessonEntity> = this.createEmptyLesson();

  constructor(
    private readonly analyticsService: LearningAnalyticsService,
    private readonly adminLessonsService: AdminLessonsService,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const [overview, learners, content, lessons] = await Promise.all([
        firstValueFrom(this.analyticsService.getAdminOverview()),
        firstValueFrom(this.analyticsService.getAdminLearners()),
        firstValueFrom(this.analyticsService.getAdminContent()),
        firstValueFrom(this.adminLessonsService.getLessons()),
      ]);
      this.overview = overview;
      this.learners = learners;
      this.contentSummary = content;
      this.managedLessons = lessons.map((lesson) => new LessonEntity(lesson));
    } finally {
      this.isLoading = false;
    }
  }

  getTaskCompletionRate(): number {
    if (!this.overview?.totalTasks) {
      return 0;
    }

    return Math.round((this.overview.completedTasks / this.overview.totalTasks) * 100);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  filteredLearners(): AdminLearnerSummary[] {
    return this.learners.filter((learner) => {
      const matchesRisk = this.riskFilter === 'all' || learner.riskLevel === this.riskFilter;
      const search = this.learnerSearch.trim().toLowerCase();
      const matchesSearch =
        !search ||
        learner.fullName.toLowerCase().includes(search) ||
        (learner.email || '').toLowerCase().includes(search);

      return matchesRisk && matchesSearch;
    });
  }

  getRiskLabel(risk: AdminLearnerSummary['riskLevel']): string {
    return {
      high: 'Atención prioritaria',
      medium: 'Seguimiento',
      low: 'Estable',
    }[risk];
  }

  getCohortSnapshot() {
    return {
      high: this.learners.filter((learner) => learner.riskLevel === 'high').length,
      medium: this.learners.filter((learner) => learner.riskLevel === 'medium').length,
      low: this.learners.filter((learner) => learner.riskLevel === 'low').length,
    };
  }

  startCreateLesson(): void {
    this.editingLessonId = null;
    this.lessonForm = this.createEmptyLesson();
  }

  editLesson(lesson: LessonEntity): void {
    this.editingLessonId = lesson.id;
    this.lessonForm = {
      ...lesson,
      content: JSON.parse(JSON.stringify(lesson.content)),
    };
  }

  async saveLesson(): Promise<void> {
    if (!this.lessonForm.title || !this.lessonForm.description || !this.lessonForm.category) {
      return;
    }

    this.isSavingLesson = true;

    try {
      const payload = {
        title: this.lessonForm.title,
        description: this.lessonForm.description,
        category: this.lessonForm.category,
        difficulty: this.lessonForm.difficulty || 'basica',
        estimatedMinutes: Number(this.lessonForm.estimatedMinutes || 10),
        published: this.lessonForm.published ?? false,
        content: this.lessonForm.content,
      };

      if (this.editingLessonId) {
        await firstValueFrom(this.adminLessonsService.updateLesson(this.editingLessonId, payload));
      } else {
        await firstValueFrom(this.adminLessonsService.createLesson(payload));
      }

      this.managedLessons = (await firstValueFrom(this.adminLessonsService.getLessons())).map(
        (lesson) => new LessonEntity(lesson),
      );
      this.contentSummary = await firstValueFrom(this.analyticsService.getAdminContent());
      this.startCreateLesson();
    } finally {
      this.isSavingLesson = false;
    }
  }

  addQuestion(): void {
    const questions = this.lessonForm.content?.questions || [];
    questions.push({
      id: questions.length + 1,
      question: '',
      options: [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
      ],
      correctAnswer: 'A',
      explanation: '',
      hint: '',
    });

    this.lessonForm = {
      ...this.lessonForm,
      content: {
        introduction: this.lessonForm.content?.introduction || '',
        text: this.lessonForm.content?.text || '',
        questions,
      },
    };
  }

  addOption(questionIndex: number): void {
    const question = this.lessonForm.content?.questions?.[questionIndex];
    if (!question) {
      return;
    }

    const nextCharCode = 65 + question.options.length;
    question.options.push({
      id: String.fromCharCode(nextCharCode),
      text: '',
    });
  }

  trackLesson(_: number, lesson: LessonEntity): number {
    return lesson.id;
  }

  trackQuestion(_: number, question: any): number {
    return question.id;
  }

  private createEmptyLesson(): Partial<LessonEntity> {
    return {
      title: '',
      description: '',
      category: 'matematicas',
      difficulty: 'basica',
      estimatedMinutes: 10,
      published: false,
      content: {
        introduction: '',
        text: '',
        questions: [],
      },
    };
  }
}
