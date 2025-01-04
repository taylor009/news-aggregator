import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NewsService } from './news.service';

@Injectable()
export class NewsScheduler {
  private readonly logger = new Logger(NewsScheduler.name);

  constructor(private readonly newsService: NewsService) {
    this.logger.log('NewsScheduler initialized');
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async fetchLatestNews() {
    this.logger.debug('Starting to fetch latest news articles...');
    try {
      // Fetch general articles
      await this.newsService.syncNews();
      this.logger.debug('Successfully fetched general articles');

      // Fetch articles by category to ensure diverse content
      const categories = [
        'technology',
        'business',
        'science',
        'health',
        'entertainment',
      ];

      // Fetch articles by specific topics
      const topics = ['ai', 'artificial intelligence', 'space', 'astronomy'];

      // First fetch by main categories
      for (const category of categories) {
        this.logger.debug(`Fetching articles for category: ${category}`);
        await this.newsService.syncNews();
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Add delay to avoid rate limiting
      }

      // Then fetch by specific topics
      for (const topic of topics) {
        this.logger.debug(`Fetching articles for topic: ${topic}`);
        await this.newsService.syncNews();
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Add delay to avoid rate limiting
      }

      this.logger.log('Successfully completed fetching all articles');
    } catch (error) {
      this.logger.error('Failed to fetch latest articles:', error.message);
    }
  }

  // Fetch articles for each category every 2 hours
  @Cron(CronExpression.EVERY_HOUR)
  async fetchCategoryNews() {
    this.logger.debug('Starting category-specific news fetch...');
    try {
      const categories = [
        'technology',
        'business',
        'science',
        'health',
        'entertainment',
      ];

      for (const category of categories) {
        this.logger.debug(`Fetching articles for category: ${category}`);
        await this.newsService.syncNews();
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Add delay to avoid rate limiting
        this.logger.debug(
          `Completed fetching articles for category: ${category}`,
        );
      }

      this.logger.log('Successfully completed fetching all category articles');
    } catch (error) {
      this.logger.error('Failed to fetch category articles:', error.message);
    }
  }
}
