import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Article } from './article.entity';

@Entity('article_analytics')
export class ArticleAnalytics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  articleId: number;

  @ManyToOne(() => Article)
  @JoinColumn({ name: 'articleId' })
  article: Article;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  shares: number;

  @Column({ default: 0 })
  bookmarks: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
