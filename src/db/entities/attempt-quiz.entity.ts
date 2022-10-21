import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class QuizAttempt extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  permalink: string;

  @Column({ default: 1 })
  attemptCount: number;

  @Column()
  lastScore: number;

  @Column()
  highestScore: number;
}
