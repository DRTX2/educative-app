import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonEntity } from './infrastructure/persistence/relational/entities/lesson.entity';
import { LessonProgressEntity } from './infrastructure/persistence/relational/entities/lesson-progress.entity';
import { SaveProgressDto } from './dto/save-progress.dto';
import { CreateLessonDto, UpdateLessonDto } from './dto/manage-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(LessonEntity)
    private lessonsRepository: Repository<LessonEntity>,
    @InjectRepository(LessonProgressEntity)
    private progressRepository: Repository<LessonProgressEntity>,
  ) {}

  async findAll(): Promise<LessonEntity[]> {
    return this.lessonsRepository.find({
      where: {
        published: true,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<LessonEntity | null> {
    return this.lessonsRepository.findOne({
      where: { id, published: true },
    });
  }

  async findAllForAdmin(): Promise<LessonEntity[]> {
    return this.lessonsRepository.find({
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  async createLesson(createLessonDto: CreateLessonDto): Promise<LessonEntity> {
    const lesson = this.lessonsRepository.create({
      title: createLessonDto.title,
      description: createLessonDto.description,
      category: createLessonDto.category,
      difficulty: createLessonDto.difficulty,
      estimatedMinutes: createLessonDto.estimatedMinutes,
      published: createLessonDto.published,
      content: createLessonDto.content,
    });

    return this.lessonsRepository.save(lesson);
  }

  async updateLesson(id: number, updateLessonDto: UpdateLessonDto): Promise<LessonEntity | null> {
    const lesson = await this.lessonsRepository.findOne({
      where: { id },
    });

    if (!lesson) {
      return null;
    }

    Object.assign(lesson, {
      title: updateLessonDto.title ?? lesson.title,
      description: updateLessonDto.description ?? lesson.description,
      category: updateLessonDto.category ?? lesson.category,
      difficulty: updateLessonDto.difficulty ?? lesson.difficulty,
      estimatedMinutes: updateLessonDto.estimatedMinutes ?? lesson.estimatedMinutes,
      published: updateLessonDto.published ?? lesson.published,
      content: updateLessonDto.content ?? lesson.content,
    });

    return this.lessonsRepository.save(lesson);
  }

  async saveProgress(
    userId: number,
    saveProgressDto: SaveProgressDto,
  ): Promise<LessonProgressEntity> {
    const lesson = await this.lessonsRepository.findOne({
      where: { id: saveProgressDto.lessonId },
    });

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const completed = saveProgressDto.score >= 60;

    const existingProgress = await this.progressRepository.findOne({
      where: {
        user: { id: userId },
        lesson: { id: saveProgressDto.lessonId },
      },
    });

    if (existingProgress) {
      existingProgress.score = saveProgressDto.score;
      existingProgress.answers = saveProgressDto.answers;
      existingProgress.completed = completed;
      return this.progressRepository.save(existingProgress);
    }

    const progress = this.progressRepository.create({
      lesson,
      user: { id: userId } as any,
      score: saveProgressDto.score,
      answers: saveProgressDto.answers,
      completed,
    });

    return this.progressRepository.save(progress);
  }

  async getProgress(userId: number): Promise<LessonProgressEntity[]> {
    return this.progressRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['lesson'],
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
