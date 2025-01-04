import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NewsService } from './news.service';

@Injectable()
export class NewsScheduler {
  private readonly logger = new Logger(NewsScheduler.name);

  constructor(private readonly newsService: NewsService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async fetchLatestNews() {
    this.logger.log('Fetching latest news articles...');
    try {
      await this.newsService.fetchAndStoreArticles();

      // Fetch articles by category to ensure diverse content
      for (const category of [
        'technology',
        'business',
        'science',
        'health',
        'entertainment',
      ]) {
        await this.newsService.fetchArticlesByCategory(category);
      }

      this.logger.log('Successfully fetched and stored latest articles');
    } catch (error) {
      this.logger.error('Failed to fetch latest articles:', error.message);
    }
  }

  // Fetch articles for each category every 2 hours
  @Cron(CronExpression.EVERY_2_HOURS)
  async fetchCategoryNews() {
    this.logger.log('Fetching category-specific news articles...');
    try {
      const categories = [
        'technology',
        'business',
        'science',
        'health',
        'entertainment',
      ];

      for (const category of categories) {
        await this.newsService.fetchArticlesByCategory(category);
        this.logger.log(
          `Successfully fetched articles for category: ${category}`,
        );
      }
    } catch (error) {
      this.logger.error('Failed to fetch category articles:', error.message);
    }
  }
}
