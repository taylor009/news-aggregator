import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsletterSubscriber } from './newsletter-subscriber.entity';

interface SubscriptionData {
  email: string;
  preferredTopics: string[];
  frequency: string;
  preferredTime?: string;
  receiveBreakingNews: boolean;
}

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(NewsletterSubscriber)
    private subscriberRepository: Repository<NewsletterSubscriber>,
  ) {}

  async subscribe(data: SubscriptionData) {
    let subscriber = await this.subscriberRepository.findOne({
      where: { email: data.email },
    });

    if (subscriber) {
      // Update existing subscriber
      subscriber.preferredTopics = data.preferredTopics;
      subscriber.frequency = data.frequency;
      subscriber.preferredTime = data.preferredTime;
      subscriber.receiveBreakingNews = data.receiveBreakingNews;
      subscriber.isActive = true;
    } else {
      // Create new subscriber
      subscriber = this.subscriberRepository.create({
        email: data.email,
        preferredTopics: data.preferredTopics,
        frequency: data.frequency,
        preferredTime: data.preferredTime,
        receiveBreakingNews: data.receiveBreakingNews,
      });
    }

    return this.subscriberRepository.save(subscriber);
  }

  async unsubscribe(email: string) {
    const subscriber = await this.subscriberRepository.findOne({
      where: { email },
    });

    if (subscriber) {
      subscriber.isActive = false;
      return this.subscriberRepository.save(subscriber);
    }

    return null;
  }

  async getActiveSubscribers() {
    return this.subscriberRepository.find({
      where: { isActive: true },
    });
  }

  async getSubscribersByFrequency(frequency: string) {
    return this.subscriberRepository.find({
      where: { frequency, isActive: true },
    });
  }

  async getSubscribersByTopic(topic: string) {
    const subscribers = await this.subscriberRepository.find({
      where: { isActive: true },
    });

    return subscribers.filter((subscriber) =>
      subscriber.preferredTopics.includes(topic),
    );
  }

  async getBreakingNewsSubscribers() {
    return this.subscriberRepository.find({
      where: { receiveBreakingNews: true, isActive: true },
    });
  }
}
