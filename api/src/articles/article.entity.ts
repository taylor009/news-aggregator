import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Expose } from 'class-transformer';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  source: string;

  @Column({ nullable: true })
  author: string;

  @Column('text')
  private categoriesJson: string;

  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  get categories(): string[] {
    try {
      return JSON.parse(this.categoriesJson);
    } catch {
      return [];
    }
  }

  set categories(value: string[]) {
    this.categoriesJson = JSON.stringify(value || []);
  }

  @BeforeInsert()
  @BeforeUpdate()
  ensureValidCategories() {
    if (!this.categoriesJson) {
      this.categoriesJson = '[]';
    }
    // Validate that it's proper JSON
    try {
      JSON.parse(this.categoriesJson);
    } catch {
      this.categoriesJson = '[]';
    }
  }
}
