import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleAnalytics } from '../entities/article-analytics.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(ArticleAnalytics)
    private analyticsRepository: Repository<ArticleAnalytics>,
  ) {}

  async trackView(articleId: number): Promise<void> {
    const analytics = await this.getOrCreateAnalytics(articleId);
    analytics.views += 1;
    await this.analyticsRepository.save(analytics);
  }

  async trackShare(articleId: number): Promise<void> {
    const analytics = await this.getOrCreateAnalytics(articleId);
    analytics.shares += 1;
    await this.analyticsRepository.save(analytics);
  }

  async trackBookmark(articleId: number, isBookmarked: boolean): Promise<void> {
    const analytics = await this.getOrCreateAnalytics(articleId);
    analytics.bookmarks += isBookmarked ? 1 : -1;
    await this.analyticsRepository.save(analytics);
  }

  async getAnalytics(articleId: number): Promise<ArticleAnalytics> {
    return this.getOrCreateAnalytics(articleId);
  }

  async getTopArticles(): Promise<ArticleAnalytics[]> {
    return this.analyticsRepository.find({
      relations: ['article'],
      order: {
        views: 'DESC',
      },
      take: 10,
    });
  }

  private async getOrCreateAnalytics(
    articleId: number,
  ): Promise<ArticleAnalytics> {
    let analytics = await this.analyticsRepository.findOne({
      where: { articleId },
    });

    if (!analytics) {
      analytics = this.analyticsRepository.create({
        articleId,
        views: 0,
        shares: 0,
        bookmarks: 0,
      });
      await this.analyticsRepository.save(analytics);
    }

    return analytics;
  }
}
