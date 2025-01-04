import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Article } from './article.entity';

@Entity('reading_history')
export class ReadingHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  articleId: number;

  @ManyToOne(() => Article)
  @JoinColumn({ name: 'articleId' })
  article: Article;

  @Column({ default: false })
  readLater: boolean;

  @Column({ default: 0 })
  readingProgress: number;

  @CreateDateColumn()
  readAt: Date;
}
