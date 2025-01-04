import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ArticlesService } from '../articles/articles.service';
import axios from 'axios';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://newsapi.org/v2';

  constructor(
    private readonly configService: ConfigService,
    private readonly articlesService: ArticlesService,
  ) {
    this.apiKey = this.configService.get<string>('NEWS_API_KEY');
    if (!this.apiKey) {
      this.logger.warn('NEWS_API_KEY is not set. News fetching will not work.');
    }
  }

  async fetchAndStoreArticles(category?: string) {
    try {
      const url = `${this.baseUrl}/top-headlines`;
      const params = {
        apiKey: this.apiKey,
        language: 'en',
        pageSize: 100,
        ...(category && { category }),
      };

      const response = await axios.get(url, { params });
      const articles = response.data.articles;

      // Process and store articles in batches
      const processedArticles = articles
        .filter(
          (article) =>
            article.title && (article.content || article.description),
        )
        .map((article) => ({
          title: article.title,
          content:
            article.content || article.description || 'No content available',
          url: article.url,
          imageUrl: article.urlToImage,
          source: article.source?.name || 'Unknown Source',
          author: article.author || 'Unknown Author',
          categories: category ? [category.toLowerCase()] : ['general'],
        }));

      if (processedArticles.length > 0) {
        await this.articlesService.createMany(processedArticles);
        this.logger.log(
          `Successfully stored ${processedArticles.length} articles`,
        );
      } else {
        this.logger.warn('No valid articles found to store');
      }
    } catch (error) {
      this.logger.error('Error fetching articles from NewsAPI:', error.message);
      throw error;
    }
  }

  async fetchArticlesByCategory(category: string) {
    return this.fetchAndStoreArticles(category);
  }

  async fetchArticlesByTopic(topic: string) {
    try {
      const url = `${this.baseUrl}/everything`;
      const params = {
        apiKey: this.apiKey,
        language: 'en',
        pageSize: 100,
        q: topic, // Use the topic as the search query
        sortBy: 'publishedAt',
      };

      const response = await axios.get(url, { params });
      const articles = response.data.articles;

      // Process and store articles in batches
      const processedArticles = articles
        .filter(
          (article) =>
            article.title && (article.content || article.description),
        )
        .map((article) => ({
          title: article.title,
          content:
            article.content || article.description || 'No content available',
          url: article.url,
          imageUrl: article.urlToImage,
          source: article.source?.name || 'Unknown Source',
          author: article.author || 'Unknown Author',
          categories: [topic.toLowerCase()], // Add the topic as a category
        }));

      if (processedArticles.length > 0) {
        await this.articlesService.createMany(processedArticles);
        this.logger.log(
          `Successfully stored ${processedArticles.length} articles for topic: ${topic}`,
        );
      } else {
        this.logger.warn(`No valid articles found for topic: ${topic}`);
      }
    } catch (error) {
      this.logger.error(
        `Error fetching articles for topic ${topic}:`,
        error.message,
      );
      throw error;
    }
  }
}
