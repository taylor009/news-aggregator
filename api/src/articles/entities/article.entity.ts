import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  content: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  urlToImage: string;

  @Column()
  publishedAt: Date;

  @Column()
  source: string;

  @Column({ nullable: true })
  category: string;
}
