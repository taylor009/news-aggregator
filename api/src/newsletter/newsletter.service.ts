import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsletterSubscriber } from './newsletter-subscriber.entity';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(NewsletterSubscriber)
    private readonly subscriberRepository: Repository<NewsletterSubscriber>,
  ) {}

  async subscribe(email: string, categories: string[] = []) {
    try {
      // Check if email already exists
      const existingSubscriber = await this.subscriberRepository.findOne({
        where: { email },
      });

      if (existingSubscriber) {
        if (!existingSubscriber.isActive) {
          // Reactivate subscription
          existingSubscriber.isActive = true;
          existingSubscriber.categories = categories;
          await this.subscriberRepository.save(existingSubscriber);
          return existingSubscriber;
        }
        throw new ConflictException('Email already subscribed');
      }

      // Create new subscriber
      const subscriber = this.subscriberRepository.create({
        email,
        categories,
        isActive: true,
      });

      return await this.subscriberRepository.save(subscriber);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Failed to subscribe to newsletter');
    }
  }

  async unsubscribe(email: string) {
    const subscriber = await this.subscriberRepository.findOne({
      where: { email },
    });

    if (!subscriber) {
      return;
    }

    subscriber.isActive = false;
    await this.subscriberRepository.save(subscriber);
  }

  async updateCategories(email: string, categories: string[]) {
    const subscriber = await this.subscriberRepository.findOne({
      where: { email },
    });

    if (!subscriber) {
      throw new Error('Subscriber not found');
    }

    subscriber.categories = categories;
    return await this.subscriberRepository.save(subscriber);
  }
}
