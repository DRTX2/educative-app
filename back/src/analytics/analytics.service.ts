import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonProgressEntity } from '../lessons/infrastructure/persistence/relational/entities/lesson-progress.entity';
import { FeedbackEntity } from '../feedback/infrastructure/persistence/relational/entities/feedback.entity';
import { TaskEntity } from '../tasks/infrastructure/persistence/relational/entities/task.entity';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';
import { LessonEntity } from '../lessons/infrastructure/persistence/relational/entities/lesson.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
    @InjectRepository(LessonProgressEntity)
    private readonly lessonProgressRepository: Repository<LessonProgressEntity>,
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(LessonEntity)
    private readonly lessonsRepository: Repository<LessonEntity>,
  ) {}

  async getMyOverview(userId: number) {
    const [tasks, progress, feedback] = await Promise.all([
      this.tasksRepository.find({
        where: { user: { id: userId } },
      }),
      this.lessonProgressRepository.find({
        where: { user: { id: userId } },
      }),
      this.feedbackRepository.find({
        where: { user: { id: userId } },
      }),
    ]);

    return {
      tasksTotal: tasks.length,
      tasksCompleted: tasks.filter((task) => task.completed).length,
      tasksPending: tasks.filter((task) => !task.completed).length,
      lessonsCompleted: progress.filter((item) => item.completed).length,
      averageScore: progress.length
        ? Math.round(progress.reduce((sum, item) => sum + Number(item.score), 0) / progress.length)
        : 0,
      bestScore: progress.length ? Math.max(...progress.map((item) => Number(item.score))) : 0,
      feedbackCount: feedback.length,
    };
  }

  async getAdminOverview() {
    const [users, tasks, progress, feedback] = await Promise.all([
      this.usersRepository.find(),
      this.tasksRepository.find(),
      this.lessonProgressRepository.find(),
      this.feedbackRepository.find({
        relations: ['user'],
        order: {
          createdAt: 'DESC',
        },
        take: 6,
      }),
    ]);

    const activeLearnerIds = new Set(progress.map((item) => item.user?.id).filter(Boolean));

    return {
      totalLearners: users.length,
      activeLearners: activeLearnerIds.size,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((task) => task.completed).length,
      totalLessonAttempts: progress.length,
      averageLessonScore: progress.length
        ? Math.round(progress.reduce((sum, item) => sum + Number(item.score), 0) / progress.length)
        : 0,
      recentFeedback: feedback.map((item) => ({
        learner:
          `${item.user?.firstName || ''} ${item.user?.lastName || ''}`.trim() ||
          item.user?.email ||
          'Estudiante',
        feedbackType: item.feedbackType,
        rating: item.rating,
        comments: item.comments,
        createdAt: item.createdAt,
      })),
    };
  }

  async getAdminLearners() {
    const [users, tasks, progress] = await Promise.all([
      this.usersRepository.find(),
      this.tasksRepository.find({
        relations: ['user'],
      }),
      this.lessonProgressRepository.find({
        relations: ['user', 'lesson'],
      }),
    ]);

    return users.map((user) => {
      const userTasks = tasks.filter((task) => task.user?.id === user.id);
      const userProgress = progress.filter((item) => item.user?.id === user.id);
      const tasksCompleted = userTasks.filter((task) => task.completed).length;
      const tasksPending = userTasks.filter((task) => !task.completed).length;
      const lessonsCompleted = userProgress.filter((item) => item.completed).length;
      const averageScore = userProgress.length
        ? Math.round(
            userProgress.reduce((sum, item) => sum + Number(item.score), 0) / userProgress.length,
          )
        : 0;
      const activityDates = [
        ...userTasks.map((task) => task.updatedAt),
        ...userProgress.map((item) => item.updatedAt),
      ]
        .filter(Boolean)
        .sort((first, second) => second.getTime() - first.getTime());
      const lastActivityAt = activityDates[0] || null;

      let riskLevel: 'high' | 'medium' | 'low' = 'low';
      if (tasksPending >= 3 || averageScore < 60 || lessonsCompleted === 0) {
        riskLevel = 'high';
      } else if (tasksPending >= 1 || averageScore < 75) {
        riskLevel = 'medium';
      }

      return {
        id: user.id,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Estudiante',
        email: user.email,
        role: user.role?.name || 'user',
        status: user.status?.name || null,
        tasksCompleted,
        tasksPending,
        lessonsCompleted,
        averageScore,
        lastActivityAt,
        riskLevel,
      };
    });
  }

  async getAdminContentSummary() {
    const [lessons, progress] = await Promise.all([
      this.lessonsRepository.find(),
      this.lessonProgressRepository.find({
        relations: ['lesson'],
      }),
    ]);

    return lessons.map((lesson) => {
      const lessonProgress = progress.filter((item) => item.lesson?.id === lesson.id);
      return {
        lessonId: lesson.id,
        title: lesson.title,
        category: lesson.category,
        difficulty: lesson.difficulty,
        totalAttempts: lessonProgress.length,
        completions: lessonProgress.filter((item) => item.completed).length,
        averageScore: lessonProgress.length
          ? Math.round(
              lessonProgress.reduce((sum, item) => sum + Number(item.score), 0) / lessonProgress.length,
            )
          : 0,
      };
    });
  }
}
