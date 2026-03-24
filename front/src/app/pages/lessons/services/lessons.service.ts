import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, firstValueFrom } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { LessonEntity } from '@core/entities/lesson.entity';
import { LessonProgressEntity } from '@core/entities/lesson-progress.entity';
import { IndexedDbService } from '@core/services/storage/indexeddb.service';
import { NetworkService } from '@core/services/network/network.service';
import { SyncService } from '@core/services/sync/sync.service';
import { starterLessons } from '@core/constants/starter-lessons';

@Injectable()
export class LessonsService {
  private readonly apiUrl = '/api/v1/lessons';

  constructor(
    private http: HttpClient,
    private indexedDb: IndexedDbService,
    private network: NetworkService,
    private sync: SyncService
  ) {}

  async initialize(): Promise<void> {
    await this.indexedDb.init();
    await this.ensureStarterLessons();

    if (this.network.isOnline) {
      try {
        await this.syncProgressFromServer();
      } catch (error) {
        console.error('No se pudo sincronizar el progreso de lecciones:', error);
      }
    }
  }

  getLessons(): Observable<LessonEntity[]> {
    if (this.network.isOnline) {
      return this.http.get<LessonEntity[]>(this.apiUrl).pipe(
        switchMap((lessons) => {
          if (!lessons.length) {
            return from(this.getCachedLessons());
          }

          return from(this.cacheLessons(lessons)).pipe(
            switchMap(() => of(lessons.map((lesson) => new LessonEntity(lesson)))),
          );
        }),
        catchError((error) => {
          console.error('No se pudieron cargar las lecciones remotas:', error);
          return from(this.getCachedLessons());
        })
      );
    }

    return from(this.getCachedLessons());
  }

  getLesson(id: number): Observable<LessonEntity | undefined> {
    return from(this.getCachedLessons()).pipe(
      switchMap((lessons) => {
        const cached = lessons.find((l) => l.id === id);
        if (cached) {
          return of(cached);
        }

        if (this.network.isOnline) {
          return this.http.get<LessonEntity>(`${this.apiUrl}/${id}`).pipe(
            tap((lesson) => {
              this.indexedDb.update('lessons', lesson).catch((err) => {
                console.error('Error caching lesson:', err);
              });
            }),
            catchError((error) => {
              console.error('Error fetching lesson:', error);
              return of(starterLessons.find((lesson) => lesson.id === id));
            })
          );
        }

        return of(starterLessons.find((lesson) => lesson.id === id));
      })
    );
  }

  async saveProgress(progress: LessonProgressEntity): Promise<void> {
    const localId = await this.indexedDb.add('lesson_progress', progress);
    progress.id = localId;

    // Si estamos online, enviar al backend
    if (this.network.isOnline) {
      try {
        await firstValueFrom(
          this.http
          .post(`${this.apiUrl}/progress`, {
            lessonId: progress.lessonId,
            score: progress.score,
            answers: progress.answers,
          }),
        );
        progress.synced = true;
        if (progress.id) {
          await this.indexedDb.update('lesson_progress', progress);
        }
      } catch (error) {
        // Si falla, agregar a cola de sincronización
        await this.sync.queueAction('POST', `${this.apiUrl}/progress`, {
          lessonId: progress.lessonId,
          score: progress.score,
          answers: progress.answers,
        });
      }
    } else {
      // Estamos offline, agregar a cola
      await this.sync.queueAction('POST', `${this.apiUrl}/progress`, {
        lessonId: progress.lessonId,
        score: progress.score,
        answers: progress.answers,
      });
    }
  }

  async getProgressForLesson(lessonId: number): Promise<LessonProgressEntity | undefined> {
    const allProgress = await this.indexedDb.getAll<LessonProgressEntity>('lesson_progress');
    const matched = allProgress.find((progress) => progress.lessonId === lessonId);
    return matched ? new LessonProgressEntity(matched) : undefined;
  }

  async getAllProgress(): Promise<LessonProgressEntity[]> {
    if (this.network.isOnline) {
      try {
        await this.syncProgressFromServer();
      } catch (error) {
        console.error('No se pudo refrescar el progreso desde el servidor:', error);
      }
    }

    const progress = await this.indexedDb.getAll<LessonProgressEntity>('lesson_progress');
    return progress.map((item) => new LessonProgressEntity(item));
  }

  private async syncProgressFromServer(): Promise<void> {
    const remoteProgress = await firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/progress/me`));
    const localProgress = await this.indexedDb.getAll<LessonProgressEntity>('lesson_progress');

    for (const item of remoteProgress) {
      const existing = localProgress.find((progress) => progress.lessonId === item.lesson?.id);
      const normalized = new LessonProgressEntity({
        lessonId: item.lesson?.id,
        score: Number(item.score),
        answers: item.answers || {},
        completed: item.completed,
        completedAt: item.completed ? item.updatedAt || item.createdAt : null,
        updatedAt: item.updatedAt || item.createdAt,
        synced: true,
      });

      if (existing?.id) {
        await this.indexedDb.update('lesson_progress', {
          ...normalized,
          id: existing.id,
        });
      } else {
        await this.indexedDb.add('lesson_progress', normalized);
      }
    }
  }

  private async ensureStarterLessons(): Promise<void> {
    const lessonsCount = await this.indexedDb.count('lessons');

    if (lessonsCount > 0) {
      return;
    }

    for (const lesson of starterLessons) {
      await this.indexedDb.update('lessons', lesson);
    }
  }

  private async getCachedLessons(): Promise<LessonEntity[]> {
    const lessons = await this.indexedDb.getAll<LessonEntity>('lessons');
    return lessons.length ? lessons.map((lesson) => new LessonEntity(lesson)) : starterLessons;
  }

  private async cacheLessons(lessons: LessonEntity[]): Promise<void> {
    for (const lesson of lessons) {
      await this.indexedDb.update('lessons', lesson);
    }
  }
}
