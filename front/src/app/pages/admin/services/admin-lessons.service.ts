import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LessonEntity } from '@core/entities/lesson.entity';

@Injectable({
  providedIn: 'root',
})
export class AdminLessonsService {
  private readonly apiUrl = '/api/v1/lessons/admin';

  constructor(private readonly http: HttpClient) {}

  getLessons(): Observable<LessonEntity[]> {
    return this.http.get<LessonEntity[]>(`${this.apiUrl}/all`);
  }

  createLesson(payload: Partial<LessonEntity>): Observable<LessonEntity> {
    return this.http.post<LessonEntity>(this.apiUrl, payload);
  }

  updateLesson(id: number, payload: Partial<LessonEntity>): Observable<LessonEntity> {
    return this.http.patch<LessonEntity>(`${this.apiUrl}/${id}`, payload);
  }
}
