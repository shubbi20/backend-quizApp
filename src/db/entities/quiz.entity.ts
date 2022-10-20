import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

export interface Ques {
  questionNo: number;
  ques: string;
  answer: string[];
  options: string[];
  type?: string;
}

@Entity()
export class Quiz extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  isPublish: boolean;

  @Column()
  permalink: string;

  @ManyToOne(() => User, (user) => user.quizes)
  createdBy: User;

  @Column({ type: 'simple-json', default: '{}' })
  questions: Array<Ques>;
}
