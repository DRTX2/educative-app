import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LessonEntity } from '@core/entities/lesson.entity';
import { LessonProgressEntity } from '@core/entities/lesson-progress.entity';
import { LessonsService } from '../services/lessons.service';

@UntilDestroy()
@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [LessonsService],
  templateUrl: './lesson-list.component.html',
  styleUrl: './lesson-list.component.scss',
})
export class LessonListComponent implements OnInit {
  lessons: LessonEntity[] = [];
  filteredLessons: LessonEntity[] = [];
  selectedCategory = 'all';
  isLoading = true;
  progressMap = new Map<number, LessonProgressEntity>();

  categories = [
    { value: 'all', label: 'Todas' },
    { value: 'matematicas', label: 'Matemáticas' },
    { value: 'ciencias', label: 'Ciencias' },
    { value: 'lengua', label: 'Lengua' },
  ];

  constructor(private readonly lessonsService: LessonsService) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.lessonsService.initialize();
      await this.loadProgress();

      this.lessonsService
        .getLessons()
        .pipe(untilDestroyed(this))
        .subscribe((lessons) => {
          this.lessons = lessons.map((lesson) => new LessonEntity(lesson));
          this.filterByCategory(this.selectedCategory);
          this.isLoading = false;
        });
    } catch (error) {
      console.error(error);
      this.isLoading = false;
    }
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.filteredLessons =
      category === 'all' ? this.lessons : this.lessons.filter((lesson) => lesson.category === category);
  }

  async loadProgress(): Promise<void> {
    const progress = await this.lessonsService.getAllProgress();

    this.progressMap = progress.reduce((map, entry) => {
      const progressEntry = new LessonProgressEntity(entry);
      const existing = map.get(progressEntry.lessonId);

      if (!existing || existing.score < progressEntry.score) {
        map.set(progressEntry.lessonId, progressEntry);
      }

      return map;
    }, new Map<number, LessonProgressEntity>());
  }

  getCompletedLessonsCount(): number {
    return this.progressMap.size;
  }

  getQuestionCount(lesson: LessonEntity): number {
    return lesson.content.questions?.length || 0;
  }

  getEstimatedMinutes(lesson: LessonEntity): number {
    return Math.max(8, this.getQuestionCount(lesson) * 2);
  }

  getLessonProgress(lessonId: number): LessonProgressEntity | undefined {
    return this.progressMap.get(lessonId);
  }

  getDifficultyLabel(difficulty: LessonEntity['difficulty']): string {
    return {
      basica: 'Base sólida',
      media: 'Desafío medio',
      avanzada: 'Nivel avanzado',
    }[difficulty];
  }

  getCategoryLabel(category: string): string {
    return this.categories.find((item) => item.value === category)?.label || category;
  }

  trackByLesson(_: number, lesson: LessonEntity): number {
    return lesson.id;
  }
}
