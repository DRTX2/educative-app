import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedbackEntity } from './infrastructure/persistence/relational/entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private feedbackRepository: Repository<FeedbackEntity>,
  ) {}

  async create(
    userId: number,
    createFeedbackDto: CreateFeedbackDto,
  ): Promise<FeedbackEntity> {
    const feedback = this.feedbackRepository.create({
      user: { id: userId } as any,
      feedbackType: createFeedbackDto.feedbackType,
      rating: createFeedbackDto.rating,
      comments: createFeedbackDto.comments || null,
      metadata: createFeedbackDto.metadata || null,
    });

    return this.feedbackRepository.save(feedback);
  }

  async findByUser(userId: number): Promise<FeedbackEntity[]> {
    return this.feedbackRepository.find({
      where: {
        user: { id: userId },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
