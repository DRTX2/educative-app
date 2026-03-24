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

export enum TaskPriorityEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity({
  name: 'tasks',
})
export class TaskEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({ type: String, length: 120 })
  clientId: string;

  @Column({ type: String, length: 160 })
  title: string;

  @Column({ type: String, nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: TaskPriorityEnum,
    default: TaskPriorityEnum.MEDIUM,
  })
  priority: TaskPriorityEnum;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date | null;

  @Column({ type: Boolean, default: false })
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
