import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MyLearningOverview {
  tasksTotal: number;
  tasksCompleted: number;
  tasksPending: number;
  lessonsCompleted: number;
  averageScore: number;
  bestScore: number;
  feedbackCount: number;
}

export interface AdminLearningOverview {
  totalLearners: number;
  activeLearners: number;
  totalTasks: number;
  completedTasks: number;
  totalLessonAttempts: number;
  averageLessonScore: number;
  recentFeedback: Array<{
    learner: string;
    feedbackType: string;
    rating: number;
    comments: string | null;
    createdAt: string;
  }>;
}

export interface AdminLearnerSummary {
  id: number;
  fullName: string;
  email: string | null;
  role: string;
  status: string | null;
  tasksCompleted: number;
  tasksPending: number;
  lessonsCompleted: number;
  averageScore: number;
  lastActivityAt: string | null;
  riskLevel: 'high' | 'medium' | 'low';
}

export interface AdminContentSummary {
  lessonId: number;
  title: string;
  category: string;
  difficulty: string;
  totalAttempts: number;
  completions: number;
  averageScore: number;
}

@Injectable({
  providedIn: 'root',
})
export class LearningAnalyticsService {
  private readonly apiUrl = '/api/v1/analytics';

  constructor(private readonly http: HttpClient) {}

  getMyOverview(): Observable<MyLearningOverview> {
    return this.http.get<MyLearningOverview>(`${this.apiUrl}/me/overview`);
  }

  getAdminOverview(): Observable<AdminLearningOverview> {
    return this.http.get<AdminLearningOverview>(`${this.apiUrl}/admin/overview`);
  }

  getAdminLearners(): Observable<AdminLearnerSummary[]> {
    return this.http.get<AdminLearnerSummary[]>(`${this.apiUrl}/admin/learners`);
  }

  getAdminContent(): Observable<AdminContentSummary[]> {
    return this.http.get<AdminContentSummary[]>(`${this.apiUrl}/admin/content`);
  }
}
