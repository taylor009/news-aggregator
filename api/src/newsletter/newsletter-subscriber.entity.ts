import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class NewsletterSubscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column('simple-array')
  preferredTopics: string[];

  @Column({ default: 'daily' })
  frequency: string;

  @Column({ nullable: true })
  preferredTime: string;

  @Column({ default: true })
  receiveBreakingNews: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
