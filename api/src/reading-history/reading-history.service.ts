import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadingHistory } from './reading-history.entity';

interface ReadingProgressData {
  userId: string;
  articleId: number;
  progress: number;
}

@Injectable()
export class ReadingHistoryService {
  constructor(
    @InjectRepository(ReadingHistory)
    private readonly readingHistoryRepository: Repository<ReadingHistory>,
  ) {}

  async trackReading(data: ReadingProgressData) {
    let history = await this.readingHistoryRepository.findOne({
      where: {
        userId: data.userId,
        articleId: data.articleId,
      },
    });

    if (history) {
      history.readingProgress = data.progress;
      history.completed = data.progress >= 0.9; // Mark as completed if 90% read
    } else {
      history = this.readingHistoryRepository.create({
        userId: data.userId,
        articleId: data.articleId,
        readingProgress: data.progress,
        completed: data.progress >= 0.9,
      });
    }

    return this.readingHistoryRepository.save(history);
  }

  async toggleReadLater(userId: string, articleId: number) {
    let history = await this.readingHistoryRepository.findOne({
      where: {
        userId,
        articleId,
      },
    });

    if (history) {
      history.readLater = !history.readLater;
    } else {
      history = this.readingHistoryRepository.create({
        userId,
        articleId,
        readLater: true,
      });
    }

    return this.readingHistoryRepository.save(history);
  }

  async getReadingHistory(userId: string) {
    return this.readingHistoryRepository.find({
      where: { userId },
      relations: ['article'],
      order: { updatedAt: 'DESC' },
    });
  }

  async getReadLaterList(userId: string) {
    return this.readingHistoryRepository.find({
      where: { userId, readLater: true },
      relations: ['article'],
      order: { updatedAt: 'DESC' },
    });
  }

  async getReadingProgress(userId: string, articleId: number) {
    const history = await this.readingHistoryRepository.findOne({
      where: {
        userId,
        articleId,
      },
    });

    return history?.readingProgress || 0;
  }

  async getRecentlyRead(userId: string, limit = 10) {
    return this.readingHistoryRepository.find({
      where: { userId, completed: true },
      relations: ['article'],
      order: { updatedAt: 'DESC' },
      take: limit,
    });
  }
}
