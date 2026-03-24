import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'lesson',
})
export class LessonEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  title: string;

  @Column({ type: String })
  description: string;

  @Column({ type: 'jsonb' })
  content: Record<string, any>;

  @Column({ type: String })
  category: string;

  @Column({ type: String, default: 'basica' })
  difficulty: string;

  @Column({ type: 'int', default: 10 })
  estimatedMinutes: number;

  @Column({ type: Boolean, default: true })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
