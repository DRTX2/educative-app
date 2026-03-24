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
import { LessonEntity } from './lesson.entity';

@Entity({
  name: 'lesson_progress',
})
export class LessonProgressEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LessonEntity, { eager: true })
  lesson: LessonEntity;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  score: number;

  @Column({ type: 'jsonb' })
  answers: Record<string, any>;

  @Column({ type: Boolean, default: false })
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
