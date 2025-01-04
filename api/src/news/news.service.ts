import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ArticlesService } from '../articles/articles.service';
import axios from 'axios';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://newsapi.org/v2';
  private readonly categories = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology',
  ];

  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => ArticlesService))
    private articlesService: ArticlesService,
  ) {
    this.apiKey = this.configService.get<string>('NEWS_API_KEY');
    if (!this.apiKey) {
      this.logger.error('NEWS_API_KEY is not set in environment variables');
    }
  }

  async fetchAndStoreArticles() {
    try {
      const response = await axios.get(`${this.apiUrl}/top-headlines`, {
        params: {
          apiKey: this.apiKey,
          language: 'en',
          pageSize: 100,
        },
      });

      const articles = response.data.articles;
      let stored = 0;

      for (const article of articles) {
        if (!article.title || !article.url) continue;

        try {
          await this.articlesService.create({
            title: article.title,
            content: article.description || article.content || '',
            url: article.url,
            imageUrl: article.urlToImage,
            source: article.source.name,
            author: article.author,
            categories: this.inferCategories(
              article.title,
              article.description,
            ),
          });
          stored++;
        } catch (error) {
          this.logger.warn(
            `Failed to store article: ${article.title}`,
            error.message,
          );
        }
      }

      this.logger.log(
        `Successfully fetched and stored ${stored} out of ${articles.length} articles`,
      );
    } catch (error) {
      this.logger.error('Error fetching articles:', error.message);
      throw error;
    }
  }

  async fetchArticlesByCategory(category: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/top-headlines`, {
        params: {
          apiKey: this.apiKey,
          category,
          language: 'en',
          pageSize: 100,
        },
      });

      const articles = response.data.articles;
      let stored = 0;

      for (const article of articles) {
        if (!article.title || !article.url) continue;

        try {
          await this.articlesService.create({
            title: article.title,
            content: article.description || article.content || '',
            url: article.url,
            imageUrl: article.urlToImage,
            source: article.source.name,
            author: article.author,
            categories: [
              category,
              ...this.inferCategories(article.title, article.description),
            ],
          });
          stored++;
        } catch (error) {
          this.logger.warn(
            `Failed to store article: ${article.title}`,
            error.message,
          );
        }
      }

      this.logger.log(
        `Successfully fetched and stored ${stored} out of ${articles.length} articles for category: ${category}`,
      );
    } catch (error) {
      this.logger.error(
        `Error fetching articles for category ${category}:`,
        error.message,
      );
      throw error;
    }
  }

  private inferCategories(title: string, description: string = ''): string[] {
    const text = `${title} ${description}`.toLowerCase();
    const categories = new Set<string>();

    // Map of keywords to categories
    const categoryKeywords = {
      technology: [
        'tech',
        'ai',
        'robot',
        'software',
        'digital',
        'cyber',
        'computing',
      ],
      business: ['business', 'economy', 'market', 'stock', 'finance', 'trade'],
      science: ['science', 'research', 'study', 'discovery', 'scientist'],
      health: [
        'health',
        'medical',
        'disease',
        'treatment',
        'doctor',
        'patient',
      ],
      environment: [
        'climate',
        'environment',
        'renewable',
        'sustainable',
        'green',
      ],
      sports: ['sport', 'game', 'player', 'team', 'tournament', 'championship'],
    };

    // Check for each category's keywords
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => text.includes(keyword))) {
        categories.add(category);
      }
    }

    return Array.from(categories);
  }
}
