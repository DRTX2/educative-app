import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

export enum FeedbackTypeEnum {
  TASK = 'task',
  LESSON = 'lesson',
  GENERAL = 'general',
}

@Entity({
  name: 'feedback',
})
export class FeedbackEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({
    type: 'enum',
    enum: FeedbackTypeEnum,
    default: FeedbackTypeEnum.GENERAL,
  })
  feedbackType: FeedbackTypeEnum;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: String, nullable: true })
  comments: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
