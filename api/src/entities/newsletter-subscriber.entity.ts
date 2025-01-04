import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('newsletter_subscribers')
export class NewsletterSubscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column('simple-array')
  preferredTopics: string[];

  @Column({
    type: 'varchar',
    default: 'daily',
    enum: ['daily', 'weekly', 'monthly'],
  })
  frequency: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'time', nullable: true })
  preferredTime: string;

  @Column({ type: 'simple-array', default: '' })
  preferredSources: string[];

  @CreateDateColumn()
  subscribedAt: Date;

  @Column({ default: true })
  receiveBreakingNews: boolean;
}
